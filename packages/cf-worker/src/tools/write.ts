import type { AgentTool } from "@mariozechner/pi-agent-core";
import { type Static, Type } from "@sinclair/typebox";
import type { IFileSystem } from "just-bash/browser";
import { WRITE_TOOL_DESCRIPTION } from "../prompts/prompts.js";

const writeSchema = Type.Object({
	path: Type.String({ description: "Absolute path to the file to write" }),
	content: Type.String({ description: "The content to write to the file" }),
});

export function createWriteTool(fs: IFileSystem): AgentTool<typeof writeSchema> {
	return {
		label: "Write",
		name: "write",
		description: WRITE_TOOL_DESCRIPTION,
		parameters: writeSchema,
		execute: async (_toolCallId: string, args: Static<typeof writeSchema>) => {
			// Create parent directories if needed
			const dir = args.path.substring(0, args.path.lastIndexOf("/"));
			if (dir) {
				await mkdirp(fs, dir);
			}

			await fs.writeFile(args.path, args.content);

			return {
				content: [
					{ type: "text" as const, text: `Successfully wrote ${args.content.length} bytes to ${args.path}` },
				],
				details: { path: args.path, bytes: args.content.length },
			};
		},
	};
}

async function mkdirp(fs: IFileSystem, dirPath: string) {
	const parts = dirPath.split("/").filter(Boolean);
	let current = "";
	for (const part of parts) {
		current += `/${part}`;
		try {
			await fs.mkdir(current);
		} catch {
			// Directory may already exist
		}
	}
}
