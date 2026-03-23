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
exports.loadDataset = loadDataset;
exports.getRegionalDataset = getRegionalDataset;
const sync_1 = require("csv-parse/sync");
const fs = __importStar(require("fs"));
/**
 * Loads dataset from file path (CSV or JSONL)
 * @param path - Absolute or relative path to dataset file
 * @returns Validated dataset
 */
async function loadDataset(path) {
    const absPath = path.isAbsolute(path) ? path : path.resolve(process.cwd(), path);
    if (!fs.existsSync(absPath)) {
        throw new Error(`Dataset not found: ${absPath}`);
    }
    const ext = path.extname(absPath).toLowerCase();
    let rows;
    if (ext === '.csv') {
        const content = fs.readFileSync(absPath, 'utf8');
        rows = (0, sync_1.parse)(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
    }
    else if (ext === '.jsonl') {
        const content = fs.readFileSync(absPath, 'utf8');
        rows = content
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
    }
    else {
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
            name: path.basename(path),
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
function getRegionalDataset(region) {
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
            format: 'jsonl',
        },
    };
}
//# sourceMappingURL=datasets.js.map