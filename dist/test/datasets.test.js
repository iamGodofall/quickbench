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
const datasets_1 = require("../src/datasets");
const path = __importStar(require("path"));
describe('datasets', () => {
    test('load CSV schema validation', async () => {
        const csvPath = path.join(process.cwd(), 'demo', 'dataset-sample.csv');
        const dataset = await (0, datasets_1.loadDataset)(csvPath);
        expect(dataset.rows.length).toBe(10);
        expect(dataset.rows[0].input).toBe('This is great!');
        expect(dataset.rows[0].expected).toBe('positive');
    });
    test('getRegionalDataset returns valid schema', () => {
        const dataset = (0, datasets_1.getRegionalDataset)('en-global');
        expect(dataset.rows.length).toBe(3);
        expect(dataset.rows[0].input).toBe('This is great service');
        expect(dataset.rows[0].expected).toBe('positive');
    });
});
//# sourceMappingURL=datasets.test.js.map