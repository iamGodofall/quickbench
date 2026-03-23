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
exports.signReport = signReport;
exports.generateReport = generateReport;
const crypto = __importStar(require("crypto"));
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
/**
 * Signs evaluation result for reproducibility and tamper-proofing
 * Uses HMAC-SHA256 with secret key (capkit integration placeholder)
 * @param report - Raw report data
 * @param secretKey - HMAC secret (default: project-derived)
 */
async function signReport(report, secretKey = 'quickbench-mvp-key') {
    const reportStr = JSON.stringify(report, null, 2);
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(reportStr)
        .digest('hex');
    const signed = {
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
function generateReport(result) {
    return yaml.dump({
        evaluation: result,
    });
}
//# sourceMappingURL=report.js.map