import type { AgentTool } from "@mariozechner/pi-agent-core";
import { type Static, Type } from "@sinclair/typebox";
import { Bash, type IFileSystem, InMemoryFs } from "just-bash/browser";
import { BASH_TOOL_DESCRIPTION } from "../prompts/prompts.js";

const bashSchema = Type.Object({
	command: Type.String({ description: "Bash command to execute" }),
});

export function createSharedFs(): IFileSystem {
	return new InMemoryFs();
}

export function createBashTool(options?: { fs?: IFileSystem }): AgentTool<typeof bashSchema> & {
	bash: Bash | null;
	reset: () => void;
} {
	let bashInstance: Bash | null = null;

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
