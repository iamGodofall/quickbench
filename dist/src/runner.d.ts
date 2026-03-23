import { Dataset } from './datasets';
/**
 * Evaluation metrics collected during benchmarking
 */
export interface EvaluationMetrics {
    accuracy: number;
    latency: {
        mean: number;
        p95: number;
    };
    cost: number;
    fairness: {
        demographicParity: number;
    };
}
/**
 * Complete evaluation result
 */
export interface EvaluationResult {
    scores: EvaluationMetrics;
    raw: Array<{
        input: string;
        output: string;
        expected: string;
        latency: number;
        correct: boolean;
    }>;
    metadata: {
        dataset: string;
        totalRows: number;
        timestamp: string;
        agent: string;
    };
}
/**
 * Agent function signature - input -> output
 */
export type AgentFunction = (input: string) => Promise<string> | string;
/**
 * Evaluation options
 */
export interface RunEvaluationOptions {
    agent: AgentFunction;
    datasetPath?: string;
    dataset?: Dataset;
    agentName?: string;
}
/**
 * Runs complete evaluation of agent against dataset
 * @param options - Evaluation configuration
 * @returns Signed evaluation result
 */
export declare function runEvaluation(options: RunEvaluationOptions): Promise<EvaluationResult>;
/**
 * Creates a simple mock agent for demos
 * Binary classifier: returns "positive" or "negative" based on keyword heuristics
 */
export declare function createMockAgent(): AgentFunction;
//# sourceMappingURL=runner.d.ts.map