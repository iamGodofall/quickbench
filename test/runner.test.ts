import { runEvaluation, createMockAgent, AgentFunction } from '../src/runner';
import { getRegionalDataset } from '../src/datasets';

const TEST_KEY = 'quickbench-test-signing-key-2026';

describe('runner', () => {
  test('mock agent accuracy calculation', async () => {
    const result = await runEvaluation({
      agent: createMockAgent(),
      dataset: getRegionalDataset('en-global'),
      agentName: 'mock-agent',
      signingKey: TEST_KEY,
    });

    expect(result.scores.accuracy).toBeGreaterThan(0);
    expect(result.raw.length).toBe(3);
    expect(result.metadata.totalRows).toBe(3);
  });

  test('latency tracking', async () => {
    const agent: AgentFunction = async (input) => input;
    const result = await runEvaluation({
      agent,
      dataset: getRegionalDataset('en-global'),
      signingKey: TEST_KEY,
    });

    expect(result.scores.latency.mean).toBeGreaterThanOrEqual(0);
    expect(result.scores.latency.p95).toBeGreaterThanOrEqual(0);
  });

  test('fairness returns a finite value when no groups are supplied', async () => {
    const agent: AgentFunction = async () => 'negative';
    const result = await runEvaluation({
      agent,
      dataset: {
        rows: [{ input: 'hello', expected: 'negative' }],
        meta: { name: 'single', totalRows: 1, format: 'jsonl' },
      },
      signingKey: TEST_KEY,
    });

    expect(Number.isFinite(result.scores.fairness.demographicParity)).toBe(true);
    expect(result.scores.fairness.demographicParity).toBe(0);
  });

  test('rejects missing signing key instead of using a shared default', async () => {
    await expect(runEvaluation({
      agent: createMockAgent(),
      dataset: getRegionalDataset('en-global'),
    })).rejects.toThrow(/signing key is required/i);
  });
});
