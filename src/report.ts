import * as crypto from 'crypto';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

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
export async function signReport(report: any, secretKey: string = 'quickbench-mvp-key'): Promise<SignedReport> {
  const reportStr = JSON.stringify(report, null, 2);
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(reportStr)
    .digest('hex');

  const signed: SignedReport = {
    report,
    signature,
    timestamp: new Date().toISOString(),
  };

  // YAML output for humans
  const yamlReport = yaml.dump({
    scores: report.scores,
    metadata: report.metadata,
    signature,
  });
  
  console.log('\n=== Quickbench Signed Report ===');
  console.log(yamlReport);
  console.log('================================');

  // JSON backup
  fs.writeFileSync('quickbench-report.json', JSON.stringify(signed, null, 2));
  
  return signed;
}

/**
 * Convenience: generate standalone report from results
 */
export function generateReport(result: any): string {
  return yaml.dump({
    evaluation: result,
  });
}
