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
export declare function loadDataset(path: string): Promise<Dataset>;
/**
 * Returns built-in regional dataset (MVP: only en-global)
 * @param region - Dataset region code
 * @returns Inline dataset for quickstart
 */
export declare function getRegionalDataset(region: string): Dataset;
//# sourceMappingURL=datasets.d.ts.map