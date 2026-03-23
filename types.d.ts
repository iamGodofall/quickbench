/// <reference types="node" />

declare module 'csv-parse/sync' {
  export function parse(csv: string, options?: {
    columns?: boolean;
    skip_empty_lines?: boolean;
    trim?: boolean;
  }): any[];
}
