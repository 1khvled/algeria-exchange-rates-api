import json
import urllib.request
from typing import Dict, Any, Optional

DEFAULT_BASE_URL = "https://squarealgerie.com"

class SquareAlgerie:
    """
    Python client for fetching real-time Algerian market data from SquareAlgerie.com
    """

    def __init__(self, base_url: str = DEFAULT_BASE_URL):
        self.base_url = base_url.rstrip("/")

    def _get(self, path: str) -> Dict[str, Any]:
        url = f"{self.base_url}{path}"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "SquareAlgerie-Python-SDK/1.0",
                "Accept": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status != 200:
                raise RuntimeError(f"SquareAlgerie API Error: HTTP {response.status}")
            return json.loads(response.read().decode("utf-8"))

    def get_square_rates(self) -> Dict[str, Any]:
        """
        Fetch parallel market exchange rates from Square Port-Saïd (Algiers).
        Returns dict containing EUR, USD, GBP, CAD, CHF, TRY, etc.
        """
        return self._get("/api/rates")

    def get_official_rates(self) -> Dict[str, Any]:
        """
        Fetch official Bank of Algeria (Banque d'Algérie) interbank exchange rates.
        """
        return self._get("/api/rates/official")

    def get_gold_prices(self) -> Dict[str, Any]:
        """
        Fetch Algerian gold market prices (18K, 24K, 21K in DZD and centimes).
        """
        return self._get("/api/gold")

    def get_spread(self, currency: str = "EUR") -> Dict[str, Any]:
        """
        Calculate the percentage spread between Square Port-Saïd and the official bank rate.
        """
        currency = currency.upper()
        square_data = self.get_square_rates()
        official_data = self.get_official_rates()

        sq_rate = next((c for c in square_data.get("currencies", []) if c.get("code") == currency), None)
        off_rate = next((r for r in official_data.get("currencies", []) if r.get("code") == currency), None)

        sq_buy = sq_rate.get("buy") if sq_rate else None
        off_sell = off_rate.get("sell") if off_rate else None

        spread_pct = None
        if sq_buy and off_sell and off_sell > 0:
            spread_pct = round(((sq_buy - off_sell) / off_sell) * 100, 2)

        return {
            "currency": currency,
            "square_buy": sq_buy,
            "official_sell": off_sell,
            "spread_percentage": spread_pct,
        }
