# 🇩🇿 Algeria Exchange Rates API & SDK

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/algeria-rates-api)
[![Python version](https://img.shields.io/badge/python-3.8%2B-brightgreen.svg)](https://pypi.org/project/square-algerie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Data Provider: Square Live DZ](https://img.shields.io/badge/Data%20Provider-SquareAlgerie.com-emerald.svg)](https://squarealgerie.com)

Official open-source developer SDK (Node.js/TypeScript & Python) to fetch real-time Algerian currency exchange rates:
* 🏛️ **Parallel Market (Square Port-Saïd, Algiers):** EUR, USD, GBP, CAD, CHF, TRY, SAR, AED, CNY, TND, MAD.
* 🏦 **Official Interbank Rates:** Official Banque d'Algérie buy/sell cotations.
* 📊 **Parallel vs Official Spread:** Automated percentage divergence calculation.
* 🪙 **P2P Digital Currencies:** Real-time USDT / BaridiMob & CCP peer-to-peer rates.
* 🥇 **Gold Market Algeria:** Live gram rates (18K, 24K, 21K) in Algerian Dinars (DZD) and traditional *Centimes*.
* 📈 **Bourse d'Alger (SGBV):** Dzair Index, equities (Biopharm, CPA, Saidal, Alliance), and government treasury bonds.

Data provided in real-time by [Square Live DZ](https://squarealgerie.com) — the premier independent financial monitor for Algeria.

---

## 🚀 Installation

### JavaScript / TypeScript (Node.js, Bun, Deno, Browser)

```bash
npm install algeria-rates-api
# or using yarn
yarn add algeria-rates-api
# or using pnpm / bun
pnpm add algeria-rates-api
bun add algeria-rates-api
```

### Python (3.8+)

```bash
pip install square-algerie
```

---

## ⚡ Quick Start

### 🟡 TypeScript / JavaScript

```typescript
import { SquareAlgerieClient } from "algeria-rates-api";

const client = new SquareAlgerieClient();

async function checkAlgeriaRates() {
  // 1. Fetch Square Port-Saïd parallel rates
  const rates = await client.getSquareRates();
  console.log(`Latest Update: ${rates.updatedAt}`);
  
  const eur = rates.currencies.find(c => c.code === "EUR");
  console.log(`100 Euro at Square: ${eur.buy * 100} DA (Achat) / ${eur.sell * 100} DA (Vente)`);

  // 2. Calculate the Parallel vs Official Spread
  const spread = await client.getCurrencySpread("EUR");
  console.log(`Square: ${spread.squareSell} DA vs Bank: ${spread.officialSell} DA`);
  console.log(`Market Spread Gap: +${spread.spreadPercentage}%`);

  // 3. Check Live Gold Prices in Algeria
  const gold = await client.getGoldPrices();
  const k18 = gold.grams.find(g => g.carat === 18);
  console.log(`Or 18K (Bijouterie): ${k18.dzd.toLocaleString()} DA (${k18.centimes.toLocaleString()} centimes)`);
}

checkAlgeriaRates();
```

---

### 🐍 Python

```python
from square_algerie import SquareAlgerie

client = SquareAlgerie()

# 1. Fetch Parallel Rates (Square Port-Saïd)
rates = client.get_square_rates()
print(f"Update: {rates.get('updatedAt')}")

for c in rates.get("currencies", [])[:3]:
    print(f"1 {c['code']}: Achat {c['buy']} DA | Vente {c['sell']} DA")

# 2. Get Euro Spread between Bank and Square
eur_spread = client.get_spread("EUR")
print(f"EUR Square: {eur_spread['square_sell']} DA | Official: {eur_spread['official_sell']} DA | Spread: +{eur_spread['spread_percentage']}%")

# 3. Get Gold Prices
gold = client.get_gold_prices()
for g in gold.get("grams", []):
    print(f"Or {g['carat']}K: {g['dzd']:,} DA ({g['centimes']:,} centimes)")
```

---

## 🌐 Public REST API Endpoints

If you prefer using raw HTTP requests, you can query the public JSON endpoints directly (CORS enabled):

| Endpoint | Description | Cache TTL |
| :--- | :--- | :--- |
| `GET https://squarealgerie.com/api/rates` | Real-time parallel exchange rates (Square Port-Saïd) | 60s |
| `GET https://squarealgerie.com/api/rates/official` | Official Bank of Algeria exchange rates | 300s |
| `GET https://squarealgerie.com/api/gold` | Gold prices per gram (18K, 21K, 24K) and ounce in DZD | 3600s |
| `GET https://squarealgerie.com/api/markets` | Bourse d'Alger (SGBV) Dzair Index and listed stock quotes | 300s |

### Example cURL:
```bash
curl -s https://squarealgerie.com/api/rates | jq .
```

---

## 🛡️ Rate Limits & Fair Use Policy

To ensure high availability and protect free tier community infrastructure, all public API endpoints enforce edge-level rate limiting powered by Cloudflare:

* **Quota:** **60 requests per minute** per client IP (1 req/sec sustained, burstable to 60).
* **Preflight Requests (`OPTIONS`):** Not counted toward the quota.
* **Response Headers:**
  * `X-RateLimit-Limit`: Maximum requests allowed in the 60-second window (`60`).
  * `X-RateLimit-Remaining`: Number of requests remaining in the current window.
  * `X-RateLimit-Reset`: Unix timestamp when the current window expires.
  * `Retry-After`: Seconds to wait before retrying if rate limit is exceeded (HTTP `429 Too Many Requests`).

> [!TIP]
> All public API endpoints return `Cache-Control: public, max-age=60, stale-while-revalidate=300`. It is best practice to cache responses on the client side for at least 60 seconds.

---

## 📚 Reference Guides & Documentation

To understand the mechanics of the Algerian parallel currency system, check out the in-depth guides published on our platform:
* 📖 [Square Port-Saïd Guide Pratique : Négociation, coupures et sécurité](https://squarealgerie.com/guides/square-port-said-guide-pratique-astuces-securite)
* 📖 [P2P USDT Algérie : Sécuriser ses transferts BaridiMob et éviter les arnaques](https://squarealgerie.com/guides/p2p-usdt-algerie-baridimob-securite-arnaques)
* 📖 [Comparatif Square Port-Saïd vs P2P USDT : Quel est le meilleur choix ?](https://squarealgerie.com/guides/comparatif-square-vs-p2p-usdt-algerie)
* 📖 [Bourse d'Alger (SGBV) : Suivi des cotations et obligations](https://squarealgerie.com/bourse)
* 📖 [Prix de l'Or en Algérie (18K, 24K, Lingots et Centimes)](https://squarealgerie.com/or)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an issue or pull request on the repository.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ⭐️ Attribution

Developed and maintained in partnership with [SquareLiveDZ](https://squarealgerie.com) — *L'Observatoire du dinar et des marchés en Algérie*.
