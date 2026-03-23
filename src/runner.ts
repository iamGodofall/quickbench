import { Dataset, loadDataset } from './datasets';
import { signReport } from './report';

/**
 * Evaluation metrics collected during benchmarking
 */
export interface EvaluationMetrics {
  accuracy: number;
  latency: {
    mean: number;
    p95: number;
  };
  cost: number; // placeholder for token cost
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

const calculateAccuracy = (correctCount: number, total: number): number => {
  return total > 0 ? correctCount / total : 0;
};

const calculateLatencyStats = (latencies: number[]): { mean: number; p95: number } => {
  const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  return { mean, p95 };
};

const calculateDemographicParity = (rawResults: any[]): number => {
  // Simple demographic parity placeholder: std dev of accuracy across demographics
  const groups = rawResults.reduce((acc: any, r: any) => {
    const demo = r.metadata?.demographic || 'default';
    acc[demo] = acc[demo] || { correct: 0, total: 0 };
    acc[demo].total += 1;
    if (r.correct) acc[demo].correct += 1;
    return acc;
  }, {});
  const accuracies = Object.values(groups).map((g: any) => g.correct / g.total);
  const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const variance = accuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / accuracies.length;
  return Math.sqrt(variance); // std dev as fairness metric (lower better)
};

/**
 * Runs complete evaluation of agent against dataset
 * @param options - Evaluation configuration
 * @returns Signed evaluation result
 */
export async function runEvaluation(options: RunEvaluationOptions): Promise<EvaluationResult> {
  const { agent, datasetPath, dataset, agentName = 'unknown' } = options;
  
  if (!dataset && !datasetPath) {
    throw new Error('Must provide dataset or datasetPath');
  }

  const ds = dataset || await loadDataset(datasetPath!);
  
  const startTime = Date.now();
  const raw: EvaluationResult['raw'] = [];
  let correctCount = 0;
  const latencies: number[] = [];

  for (const row of ds.rows) {
    const rowStart = Date.now();
    const output = await agent(row.input);
    const latency = Date.now() - rowStart;
    
    const correct = output.trim() === row.expected.trim();
    if (correct) correctCount++;
    
    raw.push({
      input: row.input,
      output: output.toString(),
      expected: row.expected,
      latency,
      correct,
      ...(row.metadata || {}),
    });
    
    latencies.push(latency);
  }

  const totalRows = ds.rows.length;
  const scores: EvaluationMetrics = {
    accuracy: calculateAccuracy(correctCount, totalRows),
    latency: calculateLatencyStats(latencies),
    cost: 0, // placeholder
    fairness: {
      demographicParity: calculateDemographicParity(raw),
    },
  };

  const result: EvaluationResult = {
    scores,
    raw,
    metadata: {
      dataset: datasetPath || 'inline',
      totalRows,
      timestamp: new Date(startTime).toISOString(),
      agent: agentName,
    },
  };

  // Auto-sign report
  await signReport(result);

  return result;
}

/**
 * Creates a simple mock agent for demos
 * Binary classifier: returns "positive" or "negative" based on keyword heuristics
 */
export function createMockAgent(): AgentFunction {
  return async (input: string): Promise<string> => {
    // Deterministic mock: check for positive keywords
    const positiveKeywords = ['good', 'great', 'positive', 'yes', 'approve'];
    const hasPositive = positiveKeywords.some(kw => input.toLowerCase().includes(kw));
    return hasPositive ? 'positive' : 'negative';
  };
}

