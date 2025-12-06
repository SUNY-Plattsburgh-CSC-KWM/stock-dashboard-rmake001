import './App.css';
import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const MAX_HISTORY = 50;

function App() {
  const [stocks, setStocks] = useState({
    AMZN: { ticker: "AMZN", name: "Amazon", price: 0, volume: 0, history: [] },
    IBM: { ticker: "IBM", name: "International Buisness Machines", price: 0, volume: 0, history: [] },
    DOW: { ticker: "DOW", name: "Dow Jones Industrial Average", price: 0, volume: 0, history: [] },
    NASDAQ: { ticker: "NASDAQ", name: "Nasdaq Composite", price: 0, volume: 0, history: [] }
  });

  useEffect(() => {
    const evtSource = new EventSource("http://localhost:31415/stocks");

    evtSource.onmessage = (e) => {
      const update = JSON.parse(e.data);
      const { ticker, price, volume } = update;

      setStocks(prev => {
        const stock = prev[ticker];
        if (!stock) return prev;
        const newHistory = [...stock.history, price].slice(-MAX_HISTORY);
        const updatedStock = { ...stock, price, volume, history: newHistory };
        drawSparkline(updatedStock);
        return { ...prev, [ticker]: updatedStock };
      });
    };

    return () => evtSource.close();
  }, []);

  function drawSparkline(stock) {
    const data = stock.history;
    const width = 100;
    const height = 30;
    d3.select(`#sparkline-${stock.ticker}`).selectAll("*").remove();
    if (data.length === 0) return;
    const svg = d3.select(`#sparkline-${stock.ticker}`).append("svg").attr("width", width).attr("height", height);
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([height, 0]);
    const line = d3.line().x((d, i) => x(i)).y(d => y(d));
    svg.append("path").datum(data).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 1.5).attr("d", line);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stock Dashboard</h1>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Sparkline</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(stocks).map(stock => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.name}</td>
              <td>{stock.price}</td>
              <td>{stock.volume}</td>
              <td><div id={`sparkline-${stock.ticker}`}></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
