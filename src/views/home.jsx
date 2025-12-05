import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  const allowedCurrencies = [
    "EUR",
    "USD",
    "GBP",
    "PLN",
    "CHF",
    "CAD",
    "AUD",
    "NOK",
    "SEK",
    "CNY",
  ];

  // 🔌 Detection de la connexion
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

  // 🔥 Récupération API + stockage local
  const fetchRates = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/EUR");
      const data = await res.json();

      // On filtre tes devises autorisées
      const filteredRates = Object.fromEntries(
        Object.entries(data.rates).filter(([currency]) =>
          allowedCurrencies.includes(currency)
        )
      );

      // 📦 stockage local
      localStorage.setItem("currency_home_base", data.base);
      localStorage.setItem(
        "currency_home_rates",
        JSON.stringify(filteredRates)
      );

      setBase(data.base);
      setRates(filteredRates);
    } catch (err) {
      console.error("Erreur API :", err);
    }
  };

  // 📥 Utiliser les données stockées si OFFLINE
  useEffect(() => {
    const storedRates = localStorage.getItem("currency_home_rates");
    const storedBase = localStorage.getItem("currency_home_base");

    if (!navigator.onLine) {
      if (storedRates) {
        setBase(storedBase || "EUR");
        setRates(JSON.parse(storedRates));
      }
      setLoading(false);
      return;
    }

    // 🌍 Si online, on appelle l'API
    fetchRates().finally(() => setLoading(false));
  }, [offline]);

  if (loading)
    return <p className="text-center mt-10 animate-pulse">Chargement...</p>;

  // 🔢 Data affichées
  const chartLabels = Object.keys(rates);
  const chartValues = chartLabels.map(
    (currency) => +(rates[currency] * amount).toFixed(4)
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Taux par rapport à EUR",
        data: chartValues,
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#a78bfa",
          "#f472b6",
          "#facc15",
          "#22d3ee",
          "#f87171",
          "#a3e635",
        ],
      },
    ],
  };

  const maxValue = Math.ceil(Math.max(...chartValues));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Taux de change EUR ${offline ? " - MODE OFFLINE" : ""}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue,
        ticks: { stepSize: 1 },
      },
    },
  };

  const displayData = chartLabels.map((currency) => ({
    currency,
    value: +(rates[currency] * amount).toFixed(4),
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-200 via-pink-100 to-yellow-200 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-red-500 via-green-500 to-blue-500 mb-8 animate-bounce">
        Convertisseur de devises{" "}
        {offline && <span className="text-red-500">(Offline)</span>}
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border-4 border-black rounded w-32 p-3 mr-2 text-black font-bold animate-ping-slow"
        />
        <span className="text-2xl font-extrabold text-black animate-pulse">
          EUR
        </span>
      </div>

      {/* Cartes des devises */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10 w-full max-w-6xl">
        {displayData.map((item) => (
          <div
            key={item.currency}
            className="p-4 rounded shadow-lg transform transition-transform hover:rotate-6 hover:scale-110"
            style={{ backgroundColor: `hsl(${Math.random() * 360},70%,80%)` }}
          >
            <div
              className="font-bold text-lg text-center"
              style={{ color: `hsl(${Math.random() * 360},70%,30%)` }}
            >
              {item.currency}
            </div>
            <p className="text-center font-bold mt-4">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Graphique centré */}
      <div className="w-full max-w-4xl h-96 bg-white p-6 rounded shadow-lg mb-10">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Home;
