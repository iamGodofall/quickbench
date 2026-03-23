import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Dataset row schema
 */
export interface DatasetRow {
  input: string;
  expected: string;
  metadata?: {
    region?: string;
    demographic?: string;
  };
}

/**
 * Loaded dataset
 */
export interface Dataset {
  rows: DatasetRow[];
  meta: {
    name: string;
    totalRows: number;
    format: 'csv' | 'jsonl';
  };
}

/**
 * Loads dataset from file path (CSV or JSONL)
 * @param path - Absolute or relative path to dataset file
 * @returns Validated dataset
 */
export async function loadDataset(filePath: string): Promise<Dataset> {
  const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`Dataset not found: ${absPath}`);
  }

  const ext = path.extname(absPath).toLowerCase();
  let rows: DatasetRow[];

  if (ext === '.csv') {
    const content = fs.readFileSync(absPath, 'utf8');
    rows = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as DatasetRow[];
  } else if (ext === '.jsonl') {
    const content = fs.readFileSync(absPath, 'utf8');
    rows = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line) as DatasetRow);
  } else {
    throw new Error(`Unsupported format: ${ext}. Use .csv or .jsonl`);
  }

  // Validate schema
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.input || !row.expected) {
      throw new Error(`Invalid row ${i}: missing 'input' or 'expected'`);
    }
  }

  return {
    rows,
    meta: {
      name: path.basename(filePath),
      totalRows: rows.length,
      format: ext === '.csv' ? 'csv' : 'jsonl',
    },
  };
}

/**
 * Returns built-in regional dataset (MVP: only en-global)
 * @param region - Dataset region code
 * @returns Inline dataset for quickstart
 */
export function getRegionalDataset(region: string): Dataset {
  if (region !== 'en-global') {
    throw new Error(`Unsupported region: ${region}. MVP supports en-global only.`);
  }

  // Inline 3-row demo dataset for tests
  return {
    rows: [
      {
        input: "This is great service",
        expected: "positive",
      },
      {
        input: "Terrible experience, very bad",
        expected: "negative",
        metadata: { region: "en-global", demographic: "groupA" },
      },
      {
        input: "I approve this",
        expected: "positive",
        metadata: { region: "en-global", demographic: "groupB" },
      },
    ],
    meta: {
      name: `builtin-${region}`,
      totalRows: 3,
      format: 'jsonl' as const,
    },
  };
}

