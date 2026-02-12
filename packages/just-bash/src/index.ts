export type { BashLogger, BashOptions, ExecOptions } from "./Bash.js";
export { Bash } from "./Bash.js";
export type {
	AllCommandName,
	CommandName,
	NetworkCommandName,
	PythonCommandName,
} from "./commands/registry.js";
export {
	getCommandNames,
	getNetworkCommandNames,
	getPythonCommandNames,
} from "./commands/registry.js";
// Custom commands API
export type { CustomCommand, LazyCommand } from "./custom-commands.js";
export { defineCommand } from "./custom-commands.js";
export { InMemoryFs } from "./fs/in-memory-fs/index.js";
export type {
	BufferEncoding,
	CpOptions,
	DirectoryEntry,
	FileContent,
	FileEntry,
	FileInit,
	FileSystemFactory,
	FsEntry,
	FsStat,
	InitialFiles,
	MkdirOptions,
	RmOptions,
	SymlinkEntry,
} from "./fs/interface.js";
export {
	MountableFs,
	type MountableFsOptions,
	type MountConfig,
} from "./fs/mountable-fs/index.js";
export type { NetworkConfig } from "./network/index.js";
export {
	NetworkAccessDeniedError,
	RedirectNotAllowedError,
	TooManyRedirectsError,
} from "./network/index.js";
// Security module - defense-in-depth
export type {
	DefenseInDepthConfig,
	DefenseInDepthHandle,
	DefenseInDepthStats,
	SecurityViolation,
	SecurityViolationType,
} from "./security/index.js";
export {
	createConsoleViolationCallback,
	DefenseInDepthBox,
	SecurityViolationError,
	SecurityViolationLogger,
} from "./security/index.js";
export type {
	BashExecResult,
	Command,
	CommandContext,
	ExecResult,
	IFileSystem,
} from "./types.js";
