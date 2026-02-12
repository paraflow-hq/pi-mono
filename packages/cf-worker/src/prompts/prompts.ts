export const BASH_TOOL_DESCRIPTION = `# Bash

Execute bash commands in a sandboxed environment with a virtual filesystem.

## When to Use
- File creation, manipulation, and inspection (echo, cat, grep, sed, awk, etc.)
- Directory operations (mkdir, ls, find, tree, etc.)
- Text processing and data transformation pipelines
- Running scripts and command sequences

## Environment
- Sandboxed in-memory bash with 90+ POSIX commands
- Virtual filesystem rooted at / with working directory /home/user
- Filesystem persists across tool calls within the session
- No network access, no system-level operations

## Available Commands
Core: echo, printf, cat, head, tail, tee, wc, sort, uniq, tr, cut, paste, rev, fold, expand, unexpand
Search: grep, find, xargs
Editors: sed, awk
Files: ls, cp, mv, rm, mkdir, rmdir, touch, chmod, ln, stat, file, du, df, realpath, basename, dirname
Text: diff, comm, join, column
Archive: tar
Other: date, env, export, set, unset, alias, test, expr, seq, yes, true, false, sleep, read, mapfile

## Important Notes
- No network commands (curl, wget, etc.)
- No package managers or installers
- Environment variables do NOT persist across calls, but files DO persist
- Use \`echo "content" > file.txt\` to create files
- Use \`cat file.txt\` to read files
`;

export const WRITE_TOOL_DESCRIPTION = `# Write File

Write content to a file in the virtual filesystem.

## When to Use
- Creating new files with specific content
- Overwriting existing files entirely

## Parameters
- path: Absolute path to the file (e.g. /home/user/file.txt)
- content: The full content to write to the file

## Notes
- Creates parent directories automatically if they don't exist
- Overwrites the file if it already exists
`;

export const READ_TOOL_DESCRIPTION = `# Read File

Read the contents of a file from the virtual filesystem.

## When to Use
- Inspecting file contents
- Reading configuration or data files

## Parameters
- path: Absolute path to the file (e.g. /home/user/file.txt)

## Notes
- Returns the full file content as text
- Returns an error if the file does not exist
`;

export const EDIT_TOOL_DESCRIPTION = `# Edit File

Edit a file by replacing a specific string with a new string.

## When to Use
- Making targeted changes to existing files
- Replacing specific code or text patterns

## Parameters
- path: Absolute path to the file (e.g. /home/user/file.txt)
- old_string: The exact string to find in the file
- new_string: The string to replace it with

## Notes
- The old_string must appear exactly once in the file
- Returns an error if the string is not found or appears multiple times
- Use write tool instead if you need to replace the entire file
`;
