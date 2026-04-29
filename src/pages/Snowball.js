import React, { useEffect, useState } from 'react';
import { calculateSnowball, getDebts } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Snowball() {
  const [snowballData, setSnowballData] = useState([]);
  const [debts, setDebts] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthsToFree, setMonthsToFree] = useState(0);

  useEffect(() => {
    getDebts().then((res) => {
      setDebts(res.data);
      fetchSnowball(0);
    });
  }, []);

  const fetchSnowball = (extra) => {
    setLoading(true);
    calculateSnowball(extra)
      .then((res) => {
        setSnowballData(res.data);
        setMonthsToFree(res.data.length);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleExtraPayment = (e) => {
    setExtraPayment(e.target.value);
  };

  const handleCalculate = () => {
    fetchSnowball(extraPayment);
  };

  const debtNames = debts.map((d) => d.name);

  const colors = [
    '#ff6b9d',
    '#a855f7',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
  ];

  if (loading) return <div style={styles.loading}>Calculating your payoff plan...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Snowball Calculator ❄️</h1>
      <p style={styles.subtitle}>
        The snowball method pays off your smallest debt first, then rolls that
        payment into the next one. Add extra monthly payments to get debt free
        even faster!
      </p>

      <div style={styles.controlRow}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Extra Monthly Payment ($)</label>
          <input
            style={styles.input}
            type="number"
            value={extraPayment}
            onChange={handleExtraPayment}
            placeholder="e.g. 100"
          />
        </div>
        <button style={styles.calculateButton} onClick={handleCalculate}>
          Calculate
        </button>
      </div>

      <div style={styles.resultBanner}>
        🎉 With <strong>${extraPayment}</strong> extra per month, you'll be debt
        free in <strong>{monthsToFree} months</strong> (
        {(monthsToFree / 12).toFixed(1)} years)!
      </div>

      {debts.length === 0 ? (
        <div style={styles.empty}>
          Add debts on the My Debts page to see your snowball plan!
        </div>
      ) : (
        <div style={styles.chartContainer}>
          <h2 style={styles.chartTitle}>Debt Payoff Timeline</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={snowballData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{
                  value: 'Month',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              {debtNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colors[index % colors.length]}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.tipsCard}>
        <h3 style={styles.tipsTitle}>💡 GirlMath Tips</h3>
        <ul style={styles.tipsList}>
          <li>Even $50 extra per month can save you thousands in interest.</li>
          <li>Once a debt is paid off, roll that full payment into the next one.</li>
          <li>Celebrate every debt you pay off — it's a big deal! 🎉</li>
          <li>If a creditor sues you, consider seeking free legal aid in your area.</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '2rem',
    color: '#ff6b9d',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    width: '220px',
  },
  calculateButton: {
    backgroundColor: '#ff6b9d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  resultBanner: {
    backgroundColor: '#fff0f6',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    fontSize: '1rem',
    color: '#333',
    borderLeft: '4px solid #ff6b9d',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  chartTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '1rem',
  },
  tipsCard: {
    backgroundColor: '#fff0f6',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  tipsTitle: {
    color: '#ff6b9d',
    marginBottom: '1rem',
  },
  tipsList: {
    color: '#555',
    lineHeight: '2',
    paddingLeft: '1.25rem',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontSize: '1.1rem',
    padding: '3rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#888',
  },
};

export default Snowball;