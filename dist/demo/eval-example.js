#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("../src/runner");
const path = __importStar(require("path"));
async function main() {
    console.log('🧪 Quickbench Demo - Sentiment Classification');
    console.log('Dataset: demo/dataset-sample.csv (10 examples)');
    const datasetPath = path.join(process.cwd(), 'demo', 'dataset-sample.csv');
    const agent = (0, runner_1.createMockAgent)();
    const result = await (0, runner_1.runEvaluation)({
        agent,
        datasetPath,
        agentName: 'sentiment-mock-v1'
    });
    console.log('\n✅ Evaluation complete! Signed report generated.');
    console.log('📊 Accuracy:', result.scores.accuracy.toFixed(3));
    console.log('⏱️  Mean Latency:', result.scores.latency.mean.toFixed(0), 'ms');
    console.log('⚖️  Fairness (DP):', result.scores.fairness.demographicParity.toFixed(3));
}
main().catch(console.error);
//# sourceMappingURL=eval-example.js.map