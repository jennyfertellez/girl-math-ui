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

function Snowball({ theme }) {
  const [snowballData, setSnowballData] = useState([]);
  const [debts, setDebts] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monthsToFree, setMonthsToFree] = useState(0);
  const [payoffOrder, setPayoffOrder] = useState([]);

  useEffect(() => {
      getDebts().then((res) => {
        setDebts(res.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchSnowball(0, res.data);
      });
    }, []);

  const fetchSnowball = (extra, debtList) => {
    setLoading(true);
    calculateSnowball(extra)
      .then((res) => {
        setSnowballData(res.data);
        setMonthsToFree(res.data.length);
        calculatePayoffOrder(res.data, debtList || debts);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const calculatePayoffOrder = (data, debtList) => {
    if (!data.length || !debtList.length) return;
    const order = [];
    const debtNames = debtList.map((d) => d.name);

    debtNames.forEach((name) => {
      const payoffMonth = data.findIndex(
        (month) => month[name] === 0
      );
      if (payoffMonth !== -1) {
        order.push({ name, month: payoffMonth + 1 });
      }
    });

    order.sort((a, b) => a.month - b.month);
    setPayoffOrder(order);
  };

  const handleCalculate = () => {
    fetchSnowball(extraPayment, debts);
  };

  const debtNames = debts.map((d) => d.name);

  const colors = [
    '#051F45',
    '#F2C4CD',
    '#4a90d9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
  ];

  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + monthsToFree);
  const debtFreeDateString = debtFreeDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (loading) return (
    <div style={{ ...styles.loading, color: theme.textMuted }}>
      Calculating your payoff plan...
    </div>
  );

  return (
    <div style={{ ...styles.container, fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ ...styles.title, color: theme.primary }}>
        Snowball Calculator ❄️
      </h1>
      <p style={{ ...styles.subtitle, color: theme.textSecondary }}>
        The snowball method pays off your smallest debt first, then rolls that
        payment into the next one. Add extra monthly payments to get debt free
        even faster!
      </p>

      {/* Extra Payment Control */}
      <div style={{
        ...styles.controlCard,
        backgroundColor: theme.cardBackground,
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
      }}>
        <div style={styles.controlRow}>
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>
              Extra Monthly Payment ($)
            </label>
            <input
              style={{
                ...styles.input,
                border: `1px solid ${theme.border}`,
                color: theme.textPrimary,
              }}
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>
          <button
            style={{
              ...styles.calculateButton,
              backgroundColor: theme.primary,
              color: theme.textLight,
            }}
            onClick={handleCalculate}
          >
            Calculate 🧮
          </button>
        </div>
      </div>

      {/* Result Banner */}
      <div style={{
        ...styles.resultBanner,
        backgroundColor: theme.primary,
        color: theme.textLight,
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            With <strong>${extraPayment}</strong> extra per month
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: theme.accent, margin: '0.25rem 0' }}>
            Debt free by {debtFreeDateString} 🎉
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            That's {monthsToFree} months ({(monthsToFree / 12).toFixed(1)} years) away
          </div>
        </div>
      </div>

      {/* Payoff Order */}
      {payoffOrder.length > 0 && (
        <div style={{
          ...styles.payoffOrderCard,
          backgroundColor: theme.cardBackground,
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`,
        }}>
          <h2 style={{ ...styles.sectionTitle, color: theme.primary }}>
            🎯 Debt Payoff Order
          </h2>
          <p style={{ ...styles.payoffSubtitle, color: theme.textMuted }}>
            Focus on these debts in this order using the snowball method:
          </p>
          {payoffOrder.map((item, index) => (
            <div
              key={item.name}
              style={{
                ...styles.payoffItem,
                backgroundColor: theme.accentLight,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div style={{
                ...styles.payoffRank,
                backgroundColor: theme.primary,
                color: theme.textLight,
              }}>
                #{index + 1}
              </div>
              <div style={styles.payoffInfo}>
                <div style={{ ...styles.payoffName, color: theme.textPrimary }}>
                  {item.name}
                </div>
                <div style={{ ...styles.payoffMonth, color: theme.textMuted }}>
                  Paid off by month {item.month} — {(() => {
                    const d = new Date();
                    d.setMonth(d.getMonth() + item.month);
                    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  })()}
                </div>
              </div>
              <div style={{ ...styles.payoffBadge, color: theme.primary }}>
                🏁 Month {item.month}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {debts.length === 0 ? (
        <div style={{ ...styles.empty, color: theme.textMuted }}>
          Add debts on the My Debts page to see your snowball plan!
        </div>
      ) : (
        <div style={{
          ...styles.chartCard,
          backgroundColor: theme.cardBackground,
          boxShadow: theme.shadow,
          border: `1px solid ${theme.border}`,
        }}>
          <h2 style={{ ...styles.sectionTitle, color: theme.primary }}>
            📈 Debt Payoff Timeline
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={snowballData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis
                dataKey="month"
                label={{
                  value: 'Month',
                  position: 'insideBottom',
                  offset: -20,
                  fill: theme.textMuted,
                }}
                tick={{ fill: theme.textMuted, fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fill: theme.textMuted, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{
                  backgroundColor: theme.cardBackground,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{
                  paddingBottom: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.85rem',
                }}
              />
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

      {/* Tips */}
      <div style={{
        ...styles.tipsCard,
        backgroundColor: theme.primary,
        color: theme.textLight,
      }}>
        <h3 style={{ ...styles.tipsTitle, color: theme.accent }}>
          💡 GirlMath Tips
        </h3>
        <ul style={styles.tipsList}>
          <li>Even $50 extra per month can save you thousands in interest.</li>
          <li>Once a debt is paid off, roll that full payment into the next one.</li>
          <li>Celebrate every debt you pay off — it's a big deal! 🎉</li>
          <li>If a creditor sues you, consider seeking free legal aid in your area.</li>
          <li>Your credit score improves as your utilization drops — keep going! 📈</li>
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
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  subtitle: {
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  },
  controlCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '220px',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: 'white',
  },
  calculateButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  resultBanner: {
    borderRadius: '16px',
    padding: '1.5rem 2rem',
    marginBottom: '1.5rem',
  },
  payoffOrderCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  payoffSubtitle: {
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  payoffItem: {
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  payoffRank: {
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  payoffInfo: {
    flex: 1,
  },
  payoffName: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  payoffMonth: {
    fontSize: '0.8rem',
    marginTop: '0.2rem',
  },
  payoffBadge: {
    fontSize: '0.85rem',
    fontWeight: '600',
    flexShrink: 0,
  },
  chartCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  tipsCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  tipsTitle: {
    fontWeight: '600',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  tipsList: {
    lineHeight: '2',
    paddingLeft: '1.25rem',
    opacity: 0.9,
  },
  empty: {
    textAlign: 'center',
    fontSize: '1.1rem',
    padding: '3rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem',
  },
};

export default Snowball;