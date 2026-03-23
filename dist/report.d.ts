/**
 * Generates human-readable and JSON reports
 */
export interface SignedReport {
    report: any;
    signature: string;
    timestamp: string;
}
/**
 * Signs evaluation result for reproducibility and tamper-proofing
 * Uses HMAC-SHA256 with secret key (capkit integration placeholder)
 * @param report - Raw report data
 * @param secretKey - HMAC secret (default: project-derived)
 */
export declare function signReport(report: any, secretKey?: string): Promise<SignedReport>;
/**
 * Convenience: generate standalone report from results
 */
export declare function generateReport(result: any): string;
//# sourceMappingURL=report.d.ts.map