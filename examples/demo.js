const { SquareAlgerieClient } = require("../dist/index");

async function run() {
  console.log("🇩🇿 Fetching live Algerian market data from SquareAlgerie.com...\n");
  const client = new SquareAlgerieClient();

  try {
    const square = await client.getSquareRates();
    console.log(`=== Marché Parallèle (Square Port-Saïd) [${square.updatedAt}] ===`);
    for (const c of square.currencies.slice(0, 5)) {
      const name = c.name || c.code;
      console.log(`- 1 ${c.code} (${name}): Achat: ${c.buy} DA | Vente: ${c.sell} DA`);
    }

    console.log("\n=== Spread Officiel vs Square Port-Saïd ===");
    const eurSpread = await client.getCurrencySpread("EUR");
    console.log(`EUR Square: ${eurSpread.squareBuy} DA | Officiel: ${eurSpread.officialSell} DA | Écart: +${eurSpread.spreadPercentage}%`);

    const usdSpread = await client.getCurrencySpread("USD");
    console.log(`USD Square: ${usdSpread.squareBuy} DA | Officiel: ${usdSpread.officialSell} DA | Écart: +${usdSpread.spreadPercentage}%`);

    console.log("\n=== Prix de l'Or en Algérie ===");
    const gold = await client.getGoldPrices();
    for (const g of gold.grams) {
      const centimes = g.dzd * 100;
      console.log(`- Or ${g.carat} Carats: ${g.dzd.toLocaleString("fr-FR")} DA (${centimes.toLocaleString("fr-FR")} centimes)`);
    }
  } catch (err) {
    console.error("Error running demo:", err.message);
  }
}

run();
