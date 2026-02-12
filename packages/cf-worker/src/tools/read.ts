import type { AgentTool } from "@mariozechner/pi-agent-core";
import { type Static, Type } from "@sinclair/typebox";
import type { IFileSystem } from "just-bash/browser";
import { READ_TOOL_DESCRIPTION } from "../prompts/prompts.js";

const readSchema = Type.Object({
	path: Type.String({ description: "Absolute path to the file to read" }),
});

export function createReadTool(fs: IFileSystem): AgentTool<typeof readSchema> {
	return {
		label: "Read",
		name: "read",
		description: READ_TOOL_DESCRIPTION,
		parameters: readSchema,
		execute: async (_toolCallId: string, args: Static<typeof readSchema>) => {
			const content = await fs.readFile(args.path, "utf-8");

			return {
				content: [{ type: "text" as const, text: content }],
				details: { path: args.path, bytes: content.length },
			};
		},
	};
}
