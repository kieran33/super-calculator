import React, { useState, useEffect } from "react";

const SELECTED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "NOK",
  "SEK",
  "CNY",
];

const Money = () => {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("EUR");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/EUR");
      const data = await res.json();

      const filteredRates = Object.fromEntries(
        Object.entries(data.rates).filter(([currency]) =>
          SELECTED_CURRENCIES.includes(currency)
        )
      );

      localStorage.setItem("currency_base", data.base);
      localStorage.setItem("currency_rates", JSON.stringify(filteredRates));

      setBase(data.base);
      setRates(filteredRates);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };

  useEffect(() => {
    const storedRates = localStorage.getItem("currency_rates");
    const storedBase = localStorage.getItem("currency_base");

    if (!navigator.onLine) {
      if (storedRates) {
        setBase(storedBase || "EUR");
        setRates(JSON.parse(storedRates));
      }
      setLoading(false);
      return;
    }

    fetchRates().finally(() => setLoading(false));
  }, [offline]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>
        Taux de change par rapport à {base}{" "}
        {offline && <span style={{ color: "red" }}>(Offline)</span>}
      </h2>

      <ul>
        {Object.entries(rates).map(([currency, rate]) => (
          <li key={currency}>
            {currency}: {rate.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Money;
