import { runEvaluation, createMockAgent, AgentFunction, EvaluationResult } from '../src/runner';
import { getRegionalDataset } from '../src/datasets';

describe('runner', () => {
  test('mock agent accuracy calculation', async () => {
    const agent = createMockAgent();
    const dataset = getRegionalDataset('en-global');
    const result = await runEvaluation({ 
      agent, 
      dataset,
      agentName: 'mock-agent' 
    });
    
    expect(result.scores.accuracy).toBeGreaterThan(0);
    expect(result.raw.length).toBe(3);
    expect(result.metadata.totalRows).toBe(3);
  });

  test('latency tracking', async () => {
    const agent: AgentFunction = async (input) => input;
    const dataset = getRegionalDataset('en-global');
    const result = await runEvaluation({ agent, dataset });
    
    expect(result.scores.latency.mean).toBeGreaterThanOrEqual(0);
    expect(result.scores.latency.p95).toBeGreaterThanOrEqual(0);
  });

  test('mock agent integration', async () => {
    const agent = createMockAgent();
    const result = await runEvaluation({ agent, dataset: getRegionalDataset('en-global') });
    
    expect(typeof result.scores.fairness.demographicParity).toBe('number');
  });
});
