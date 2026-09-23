import { Dataset, loadDataset } from './datasets';
import { signReport } from './report';

/**
 * Evaluation metrics collected during benchmarking.
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
 * Complete evaluation result.
 */
export interface EvaluationResult {
  scores: EvaluationMetrics;
  raw: Array<{
    input: string;
    output: string;
    expected: string;
    latency: number;
    correct: boolean;
    metadata?: Record<string, unknown>;
  }>;
  metadata: {
    dataset: string;
    totalRows: number;
    timestamp: string;
    agent: string;
  };
}

export type AgentFunction = (input: string) => Promise<string> | string;

export interface RunEvaluationOptions {
  agent: AgentFunction;
  datasetPath?: string;
  dataset?: Dataset;
  agentName?: string;
  signingKey?: string;
}

const calculateAccuracy = (correctCount: number, total: number): number => {
  return total > 0 ? correctCount / total : 0;
};

const calculateLatencyStats = (latencies: number[]): { mean: number; p95: number } => {
  if (latencies.length === 0) {
    return { mean: 0, p95: 0 };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const p95Index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1);
  return { mean, p95: sorted[p95Index] };
};

const calculateDemographicParity = (rawResults: EvaluationResult['raw']): number => {
  const groups = rawResults.reduce<Record<string, { correct: number; total: number }>>((acc, r) => {
    const demo = r.metadata?.demographic;
    if (typeof demo !== 'string' || demo.length === 0) return acc;

    acc[demo] ??= { correct: 0, total: 0 };
    acc[demo].total += 1;
    if (r.correct) acc[demo].correct += 1;
    return acc;
  }, {});

  const accuracies = Object.values(groups)
    .filter(group => group.total > 0)
    .map(group => group.correct / group.total);

  if (accuracies.length < 2) return 0;

  const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const variance = accuracies.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / accuracies.length;
  return Math.sqrt(variance);
};

export async function runEvaluation(options: RunEvaluationOptions): Promise<EvaluationResult> {
  const { agent, datasetPath, dataset, agentName = 'unknown', signingKey } = options;

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
    const normalizedOutput = String(output);
    const correct = normalizedOutput.trim() === row.expected.trim();

    if (correct) correctCount++;

    raw.push({
      input: row.input,
      output: normalizedOutput,
      expected: row.expected,
      latency,
      correct,
      metadata: row.metadata,
    });

    latencies.push(latency);
  }

  const totalRows = ds.rows.length;
  const scores: EvaluationMetrics = {
    accuracy: calculateAccuracy(correctCount, totalRows),
    latency: calculateLatencyStats(latencies),
    cost: 0,
    fairness: {
      demographicParity: calculateDemographicParity(raw),
    },
  };

  const result: EvaluationResult = {
    scores,
    raw,
    metadata: {
      dataset: datasetPath || ds.meta.name || 'inline',
      totalRows,
      timestamp: new Date(startTime).toISOString(),
      agent: agentName,
    },
  };

  await signReport(result, signingKey);
  return result;
}

export function createMockAgent(): AgentFunction {
  return async (input: string): Promise<string> => {
    const positiveKeywords = ['good', 'great', 'positive', 'yes', 'approve'];
    const hasPositive = positiveKeywords.some(kw => input.toLowerCase().includes(kw));
    return hasPositive ? 'positive' : 'negative';
  };
}
