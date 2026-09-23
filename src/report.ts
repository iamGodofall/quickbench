import * as crypto from 'crypto';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * Generates human-readable and JSON reports.
 */
export interface SignedReport {
  report: any;
  signature: string;
  timestamp: string;
}

function resolveSigningKey(secretKey?: string): string {
  const key = secretKey ?? process.env.QUICKBENCH_SIGNING_KEY;
  if (!key || key.length < 16) {
    throw new Error(
      'A signing key is required. Pass secretKey or set QUICKBENCH_SIGNING_KEY to at least 16 characters.'
    );
  }
  return key;
}

/**
 * Signs an evaluation result for reproducibility and tamper evidence.
 *
 * A caller must supply the signing key explicitly or through
 * QUICKBENCH_SIGNING_KEY. Quickbench never ships a shared default secret.
 */
export async function signReport(report: any, secretKey?: string): Promise<SignedReport> {
  const key = resolveSigningKey(secretKey);
  const reportStr = JSON.stringify(report);
  const signature = crypto
    .createHmac('sha256', key)
    .update(reportStr)
    .digest('hex');

  const signed: SignedReport = {
    report,
    signature,
    timestamp: new Date().toISOString(),
  };

  const yamlReport = yaml.dump({
    scores: report.scores,
    metadata: report.metadata,
    signature,
  });

  console.log('\n=== Quickbench Signed Report ===');
  console.log(yamlReport);
  console.log('================================');

  fs.writeFileSync('quickbench-report.json', JSON.stringify(signed, null, 2));

  return signed;
}

/**
 * Verifies a signed report against the same caller-controlled secret.
 */
export function verifyReport(signed: SignedReport, secretKey?: string): boolean {
  const key = resolveSigningKey(secretKey);
  const reportStr = JSON.stringify(signed.report);
  const expected = crypto
    .createHmac('sha256', key)
    .update(reportStr)
    .digest('hex');

  const supplied = Buffer.from(signed.signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return supplied.length === expectedBuffer.length &&
    crypto.timingSafeEqual(supplied, expectedBuffer);
}

/**
 * Convenience: generate standalone report from results.
 */
export function generateReport(result: any): string {
  return yaml.dump({
    evaluation: result,
  });
}
