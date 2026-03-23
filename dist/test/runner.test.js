"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("../src/runner");
const datasets_1 = require("../src/datasets");
describe('runner', () => {
    test('mock agent accuracy calculation', async () => {
        const agent = (0, runner_1.createMockAgent)();
        const dataset = (0, datasets_1.getRegionalDataset)('en-global');
        const result = await (0, runner_1.runEvaluation)({
            agent,
            dataset,
            agentName: 'mock-agent'
        });
        expect(result.scores.accuracy).toBeGreaterThan(0);
        expect(result.raw.length).toBe(3);
        expect(result.metadata.totalRows).toBe(3);
    });
    test('latency tracking', async () => {
        const agent = async (input) => input;
        const dataset = (0, datasets_1.getRegionalDataset)('en-global');
        const result = await (0, runner_1.runEvaluation)({ agent, dataset });
        expect(result.scores.latency.mean).toBeGreaterThanOrEqual(0);
        expect(result.scores.latency.p95).toBeGreaterThanOrEqual(0);
    });
    test('mock agent integration', async () => {
        const agent = (0, runner_1.createMockAgent)();
        const result = await (0, runner_1.runEvaluation)({ agent, dataset: (0, datasets_1.getRegionalDataset)('en-global') });
        expect(typeof result.scores.fairness.demographicParity).toBe('number');
    });
});
//# sourceMappingURL=runner.test.js.map