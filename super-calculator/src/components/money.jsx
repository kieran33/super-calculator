import React, { useState, useEffect } from "react";

const Money = () => {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBase(data.base || "EUR");
        setRates(data.rates || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Taux de change par rapport à {base}</h2>
      <ul>
        {Object.entries(rates).map(([currency, rate]) => {
          const value = typeof rate === "number" ? rate.toFixed(4) : "N/A";

          return (
            <li key={currency}>
              {currency}: {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Money;
