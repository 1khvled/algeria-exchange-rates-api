/**
 * Algeria Currency & Financial Market SDK
 * Powered by SquareAlgerie.com (https://squarealgerie.com)
 * 
 * Provides real-time parallel rates (Square Port-Saïd), official bank rates,
 * P2P USDT rates (BaridiMob), Algerian gold prices, and Bourse d'Alger cotations.
 */

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  buy: number | null;
  sell: number | null;
  updatedAt?: string;
}

export interface RatesSnapshot {
  updatedAt: string;
  currencies: CurrencyRate[];
  source: string;
}

export interface OfficialRate {
  code: string;
  buy: number;
  sell: number;
}

export interface GoldPrice {
  carat: number;
  dzd: number;
  centimes: number;
}

export interface GoldSnapshot {
  updatedAt: string;
  grams: GoldPrice[];
  ounceDzd: number;
}

export interface SgbvQuote {
  code: string;
  name: string;
  price: number | null;
  changePct: number | null;
  type: "stock" | "index" | "bond";
}

const DEFAULT_BASE_URL = "https://squarealgerie.com";

export class SquareAlgerieClient {
  private baseUrl: string;

  constructor(options?: { baseUrl?: string }) {
    this.baseUrl = (options?.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  /**
   * Fetches real-time parallel market rates (Square Port-Saïd, Algiers).
   */
  async getSquareRates(): Promise<RatesSnapshot> {
    const res = await fetch(`${this.baseUrl}/api/rates`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch rates from SquareAlgerie: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Fetches official Bank of Algeria exchange rates.
   */
  async getOfficialRates(): Promise<{ updatedAt: string; currencies: OfficialRate[] }> {
    const res = await fetch(`${this.baseUrl}/api/rates/official`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch official rates: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Fetches real-time Algerian gold market prices (18K, 24K, 21K in DZD and centimes).
   */
  async getGoldPrices(): Promise<GoldSnapshot> {
    const res = await fetch(`${this.baseUrl}/api/gold`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch gold prices: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Calculates the percentage spread between Square Port-Saïd and the official bank rate.
   * @param currencyCode e.g. "EUR", "USD"
   */
  async getCurrencySpread(currencyCode = "EUR"): Promise<{
    currency: string;
    squareBuy: number | null;
    officialSell: number | null;
    spreadPercentage: number | null;
  }> {
    const [square, official] = await Promise.all([
      this.getSquareRates(),
      this.getOfficialRates(),
    ]);

    const sq = square.currencies?.find((c) => c.code.toUpperCase() === currencyCode.toUpperCase());
    const off = official.currencies?.find((r) => r.code.toUpperCase() === currencyCode.toUpperCase());

    const squareBuy = sq?.buy ?? null;
    const officialSell = off?.sell ?? null;

    let spreadPercentage: number | null = null;
    if (squareBuy && officialSell && officialSell > 0) {
      spreadPercentage = Number((((squareBuy - officialSell) / officialSell) * 100).toFixed(2));
    }

    return {
      currency: currencyCode.toUpperCase(),
      squareBuy,
      officialSell,
      spreadPercentage,
    };
  }
}

// Export default singleton instance
export const squareAlgerie = new SquareAlgerieClient();
export default squareAlgerie;
