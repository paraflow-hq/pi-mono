import type { AgentTool } from "@mariozechner/pi-agent-core";
import { type Static, Type } from "@sinclair/typebox";
import type { IFileSystem } from "just-bash/browser";
import { EDIT_TOOL_DESCRIPTION } from "../prompts/prompts.js";

const editSchema = Type.Object({
	path: Type.String({ description: "Absolute path to the file to edit" }),
	old_string: Type.String({ description: "The exact string to find and replace" }),
	new_string: Type.String({ description: "The replacement string" }),
});

export function createEditTool(fs: IFileSystem): AgentTool<typeof editSchema> {
	return {
		label: "Edit",
		name: "edit",
		description: EDIT_TOOL_DESCRIPTION,
		parameters: editSchema,
		execute: async (_toolCallId: string, args: Static<typeof editSchema>) => {
			const content = await fs.readFile(args.path, "utf-8");

			const occurrences = content.split(args.old_string).length - 1;
			if (occurrences === 0) {
				throw new Error(`String not found in ${args.path}:\n${args.old_string}`);
			}
			if (occurrences > 1) {
				throw new Error(
					`String found ${occurrences} times in ${args.path}. The old_string must be unique. Provide more context to make it unique.`,
				);
			}

			const newContent = content.replace(args.old_string, args.new_string);
			await fs.writeFile(args.path, newContent);

			return {
				content: [{ type: "text" as const, text: `Successfully edited ${args.path}` }],
				details: { path: args.path },
			};
		},
	};
}
