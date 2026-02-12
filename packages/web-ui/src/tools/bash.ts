import type { AgentTool } from "@mariozechner/pi-agent-core";
import { type Static, Type } from "@sinclair/typebox";
import type * as JustBash from "just-bash/browser";
import type { IFileSystem } from "just-bash/browser";
import { BASH_TOOL_DESCRIPTION } from "../prompts/prompts.js";

const bashSchema = Type.Object({
	command: Type.String({ description: "Bash command to execute" }),
});

// Polyfill `process` for just-bash's browser build which references process.pid etc.
function ensureProcessShim() {
	if (typeof globalThis.process === "undefined") {
		(globalThis as any).process = {
			pid: 1,
			ppid: 0,
			getuid: () => 1000,
			getgid: () => 1000,
			env: {},
			cwd: () => "/",
		};
	} else {
		// process may exist but lack pid (e.g. Vite injects a partial process object)
		const proc = globalThis.process as any;
		if (proc.pid === undefined) proc.pid = 1;
		if (proc.ppid === undefined) proc.ppid = 0;
		if (!proc.getuid) proc.getuid = () => 1000;
		if (!proc.getgid) proc.getgid = () => 1000;
	}
}

// Cache the dynamic import so it's only loaded once
let justBashModule: typeof JustBash | null = null;

async function loadJustBash() {
	if (!justBashModule) {
		ensureProcessShim();
		justBashModule = await import("just-bash/browser");
	}
	return justBashModule;
}

export async function createSharedFs(): Promise<IFileSystem> {
	try {
		const { OpfsBackedFs } = await import("./opfs-fs.js");
		return await OpfsBackedFs.create();
	} catch {
		const { InMemoryFs } = await loadJustBash();
		return new InMemoryFs();
	}
}

export function createBashTool(options?: { fs?: IFileSystem }): AgentTool<typeof bashSchema> & {
	bash: any | null;
	reset: () => void;
} {
	let bashInstance: any | null = null;

	return {
		label: "Bash",
		name: "bash",
		description: BASH_TOOL_DESCRIPTION,
		parameters: bashSchema,
		get bash() {
			return bashInstance;
		},
		reset() {
			bashInstance = null;
		},
		execute: async (_toolCallId: string, args: Static<typeof bashSchema>, signal?: AbortSignal) => {
			if (signal?.aborted) throw new Error("Execution aborted");

			if (!bashInstance) {
				const { Bash, InMemoryFs } = await loadJustBash();
				bashInstance = new Bash({ fs: options?.fs ?? new InMemoryFs(), cwd: "/home/user" });
			}

			const result = await bashInstance.exec(args.command);
			const output = [result.stdout, result.stderr].filter(Boolean).join("\n");

			if (result.exitCode !== 0) {
				throw new Error(output || `Command failed with exit code ${result.exitCode}`);
			}

			return {
				content: [{ type: "text" as const, text: output || "(no output)" }],
				details: { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode },
			};
		},
	};
}
