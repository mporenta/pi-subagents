import type { SubagentParamsLike } from "../runs/foreground/subagent-executor.ts";

export type BuiltinWorkflowName = "implementation" | "research_handoff" | "parallel_review";

/**
 * Built-in workflow presets for pi-subagents.
 *
 * These are TypeScript-first presets for the pi.dev extension harness and can
 * be expanded into standard subagent params before execution.
 */
export function resolveBuiltinWorkflow(workflow: BuiltinWorkflowName, task: string): Pick<SubagentParamsLike, "chain" | "tasks" | "context"> {
	switch (workflow) {
		case "implementation":
			return {
				context: "fresh",
				chain: [
					{ agent: "scout", task: `Map relevant code and constraints for: ${task}` },
					{ agent: "planner", task: "Read {previous} and produce a concrete implementation plan." },
					{ agent: "worker", task: "Implement the approved plan from {previous}." },
					{ agent: "reviewer", task: "Review the implementation from {previous} and suggest minimal fixes." },
				],
			};
		case "research_handoff":
			return {
				context: "fresh",
				chain: [
					{ parallel: [
						{ agent: "researcher", task: `Research external sources for: ${task}` },
						{ agent: "context-builder", task: `Build local code context for: ${task}` },
					] },
					{ agent: "planner", task: "Synthesize {previous} into an implementation-ready plan." },
				],
			};
		case "parallel_review":
			return {
				context: "fresh",
				tasks: [
					{ agent: "reviewer", task: `Review for correctness/regressions: ${task}` },
					{ agent: "reviewer", task: `Review for tests/validation gaps: ${task}` },
					{ agent: "reviewer", task: `Review for simplicity/maintainability: ${task}` },
				],
			};
	}
}
