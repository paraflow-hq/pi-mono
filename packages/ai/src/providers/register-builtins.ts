import { clearApiProviders, registerApiProvider } from "../api-registry.js";
import { streamAnthropic, streamSimpleAnthropic } from "./anthropic.js";

export function registerBuiltInApiProviders(): void {
	registerApiProvider({
		api: "anthropic-messages",
		stream: streamAnthropic,
		streamSimple: streamSimpleAnthropic,
	});
}

export function resetApiProviders(): void {
	clearApiProviders();
	registerBuiltInApiProviders();
}
