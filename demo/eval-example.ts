#!/usr/bin/env node

import { runEvaluation, createMockAgent } from '../src/runner';
import { loadDataset } from '../src/datasets';
import * as path from 'path';

async function main() {
  console.log('🧪 Quickbench Demo - Sentiment Classification');
  console.log('Dataset: demo/dataset-sample.csv (10 examples)');
  
  const datasetPath = path.join(process.cwd(), 'demo', 'dataset-sample.csv');
  const agent = createMockAgent();
  
  const result = await runEvaluation({
    agent,
    datasetPath,
    agentName: 'sentiment-mock-v1'
  });
  
  console.log('\n✅ Evaluation complete! Signed report generated.');
  console.log('📊 Accuracy:', result.scores.accuracy.toFixed(3));
  console.log('⏱️  Mean Latency:', result.scores.latency.mean.toFixed(0), 'ms');
  console.log('⚖️  Fairness (DP):', result.scores.fairness.demographicParity.toFixed(3));
  console.log('\n🌐 Opening interactive chart...');
  
  require('open')('demo/report-viewer.html');
}

main().catch(console.error);
