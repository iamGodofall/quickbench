# Quickbench 🏃‍♂️

Stop guessing if your agent works. Run reproducible, sovereign evaluations **locally**.

## 🚀 Quick Start (2 minutes)

```bash
npm install quickbench
npm run demo
```

**See signed report instantly** with accuracy, latency, fairness metrics.

## 📊 Metrics Explained

| Metric | Description | Formula |
|--------|-------------|---------|
| **Accuracy** | Exact match rate | `correct/total` |
| **Latency** | Response time | Mean + P95 (ms) |
| **Fairness** | Demographic parity | StdDev(accuracy per demographic) |
| **Cost** | Token cost | Placeholder (future LLM) |

## 📖 Full Usage

```typescript
import { runEvaluation, createMockAgent } from 'quickbench';
import { loadDataset } from 'quickbench';

const agent = (input: string) => 'your agent logic';
const dataset = await loadDataset('./my-data.csv');

const result = await runEvaluation({ agent, dataset });
console.log(result.scores.accuracy); // 0.87
```

## 🔒 Security Model

1. **Zero Cloud**: No APIs, no telemetry
2. **Local Signing**: HMAC-SHA256 receipts
3. **No PII**: Metadata-only tracking
4. **Deterministic**: Fixed seeds, reproducible

## 🗂️ Dataset Format (CSV)

```csv
input,expected,metadata
"This is great!",positive,{"region":"en","demographic":"A"}
"Awful service.",negative
```

## 🧪 Example Output

```
=== Quickbench Signed Report ===
scores:
  accuracy: 0.7
  latency: 
    mean: 2ms
    p95: 5ms
  fairness:
    demographicParity: 0.02
signature: abc123...
```

## 🛠️ Capkit Integration

```bash
npm i capkit quickbench
# Secure agent with capkit, eval with quickbench
```

---

**Part of the Agent Builder Suite**  
→ [capkit](https://github.com/iamGodofall/capkit): Scoped capabilities for agents  
→ [quickbench](https://github.com/iamGodofall/quickbench): Reproducible agent evaluation  
→ [edge-run](https://github.com/iamGodofall/edge-run): Offline-first orchestration *(coming soon)*  
→ [connector-starter](https://github.com/iamGodofall/connector-starter): Generate adapters fast *(coming soon)*

*Built for builders who ship. MIT licensed. Local-first by design.*

## 🤝 License

MIT - Ships sovereign, stays sovereign.
