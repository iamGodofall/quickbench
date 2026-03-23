"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEvaluation = runEvaluation;
exports.createMockAgent = createMockAgent;
const datasets_1 = require("./datasets");
const report_1 = require("./report");
const calculateAccuracy = (correctCount, total) => {
    return total > 0 ? correctCount / total : 0;
};
const calculateLatencyStats = (latencies) => {
    const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    latencies.sort((a, b) => a - b);
    const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
    return { mean, p95 };
};
const calculateDemographicParity = (rawResults) => {
    // Simple demographic parity placeholder: std dev of accuracy across demographics
    const groups = rawResults.reduce((acc, r) => {
        const demo = r.metadata?.demographic || 'default';
        acc[demo] = acc[demo] || { correct: 0, total: 0 };
        acc[demo].total += 1;
        if (r.correct)
            acc[demo].correct += 1;
        return acc;
    }, {});
    const accuracies = Object.values(groups).map((g) => g.correct / g.total);
    const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const variance = accuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / accuracies.length;
    return Math.sqrt(variance); // std dev as fairness metric (lower better)
};
/**
 * Runs complete evaluation of agent against dataset
 * @param options - Evaluation configuration
 * @returns Signed evaluation result
 */
async function runEvaluation(options) {
    const { agent, datasetPath, dataset, agentName = 'unknown' } = options;
    if (!dataset && !datasetPath) {
        throw new Error('Must provide dataset or datasetPath');
    }
    const ds = dataset || await (0, datasets_1.loadDataset)(datasetPath);
    const startTime = Date.now();
    const raw = [];
    let correctCount = 0;
    const latencies = [];
    for (const row of ds.rows) {
        const rowStart = Date.now();
        const output = await agent(row.input);
        const latency = Date.now() - rowStart;
        const correct = output.trim() === row.expected.trim();
        if (correct)
            correctCount++;
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
    const scores = {
        accuracy: calculateAccuracy(correctCount, totalRows),
        latency: calculateLatencyStats(latencies),
        cost: 0, // placeholder
        fairness: {
            demographicParity: calculateDemographicParity(raw),
        },
    };
    const result = {
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
    await (0, report_1.signReport)(result);
    return result;
}
/**
 * Creates a simple mock agent for demos
 * Binary classifier: returns "positive" or "negative" based on keyword heuristics
 */
function createMockAgent() {
    return async (input) => {
        // Deterministic mock: check for positive keywords
        const positiveKeywords = ['good', 'great', 'positive', 'yes', 'approve'];
        const hasPositive = positiveKeywords.some(kw => input.toLowerCase().includes(kw));
        return hasPositive ? 'positive' : 'negative';
    };
}
//# sourceMappingURL=runner.js.map