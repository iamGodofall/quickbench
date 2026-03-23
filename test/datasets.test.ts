import { loadDataset, getRegionalDataset, Dataset } from '../src/datasets';
import * as path from 'path';
import * as fs from 'fs';

describe('datasets', () => {
  test('load CSV schema validation', async () => {
    const csvPath = path.join(process.cwd(), 'demo', 'dataset-sample.csv');
    const dataset = await loadDataset(csvPath);
    
    expect(dataset.rows.length).toBe(10);
    expect(dataset.rows[0].input).toBe('This is great!');
    expect(dataset.rows[0].expected).toBe('positive');
  });

  test('getRegionalDataset returns valid schema', () => {
    const dataset = getRegionalDataset('en-global');
    expect(dataset.rows.length).toBe(3);
    expect(dataset.rows[0].input).toBe('This is great service');
    expect(dataset.rows[0].expected).toBe('positive');
  });
});
