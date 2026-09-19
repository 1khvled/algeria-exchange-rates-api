import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from square_algerie import SquareAlgerie

def main():
    print("🇩🇿 Interrogeant SquareAlgerie.com pour les cotations en direct...\n")
    client = SquareAlgerie()

    try:
        rates = client.get_square_rates()
        print(f"=== Marché Parallèle (Square Port-Saïd) [{rates.get('updatedAt')}] ===")
        for c in rates.get("currencies", [])[:5]:
            name = c.get("name", c.get("code"))
            print(f"- 1 {c['code']} ({name}): Achat: {c['buy']} DA | Vente: {c['sell']} DA")

        print("\n=== Spread Officiel vs Square Port-Saïd ===")
        eur_spread = client.get_spread("EUR")
        print(f"EUR Square: {eur_spread['square_buy']} DA | Officiel: {eur_spread['official_sell']} DA | Écart: +{eur_spread['spread_percentage']}%")

        gold = client.get_gold_prices()
        print("\n=== Prix de l'Or en Algérie ===")
        for g in gold.get("grams", []):
            centimes = g['dzd'] * 100
            print(f"- Or {g['carat']}K: {g['dzd']:,} DA ({centimes:,} centimes)")

    except Exception as e:
        print("Erreur:", e)

if __name__ == "__main__":
    main()
