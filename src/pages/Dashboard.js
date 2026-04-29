import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading your financial summary...</div>;
  if (!summary) return <div style={styles.loading}>No data found. Add your debts and savings goals to get started!</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Financial Dashboard 💅</h1>

      <div style={styles.cardRow}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Debt</div>
          <div style={styles.cardValue}>${summary.totalDebt.toLocaleString()}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Monthly Minimums</div>
          <div style={styles.cardValue}>${summary.totalMinimumPayments.toLocaleString()}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Months to Debt Free</div>
          <div style={styles.cardValue}>{summary.monthsToDebtFree}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Saved</div>
          <div style={styles.cardValue}>${summary.totalSaved.toLocaleString()}</div>
        </div>
      </div>

      <h2 style={styles.subtitle}>Savings Goals Progress</h2>
      {summary.savingsProjections.map((goal, index) => (
        <div key={index} style={styles.goalCard}>
          <div style={styles.goalHeader}>
            <span style={styles.goalName}>{goal.goalName}</span>
            <span style={styles.goalPercent}>{goal.percentComplete}% complete</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${goal.percentComplete}%`,
              }}
            />
          </div>
          <div style={styles.goalDetails}>
            <span>${goal.currentSavings.toLocaleString()} saved</span>
            <span>${goal.targetAmount.toLocaleString()} goal</span>
          </div>
          <div style={styles.goalFooter}>
            🏠 Projected date: <strong>{goal.projectedDate}</strong> ({goal.monthsRemaining} months away)
          </div>
        </div>
      ))}

      <h2 style={styles.subtitle}>Your Debts</h2>
      {summary.debts.map((debt, index) => (
        <div key={index} style={styles.debtCard}>
          <div style={styles.debtName}>{debt.name}</div>
          <div style={styles.debtDetails}>
            <span>Balance: <strong>${debt.balance.toLocaleString()}</strong></span>
            <span>APR: <strong>{debt.interestRate}%</strong></span>
            <span>Minimum: <strong>${debt.minimumPayment}</strong></span>
          </div>
        </div>
      ))}
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
    marginBottom: '1.5rem',
  },
  subtitle: {
    fontSize: '1.4rem',
    color: '#333',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  cardRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#fff0f6',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '0.5rem',
  },
  cardValue: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#ff6b9d',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  goalName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  goalPercent: {
    color: '#ff6b9d',
    fontWeight: 'bold',
  },
  progressBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: '999px',
    height: '12px',
    marginBottom: '0.5rem',
  },
  progressFill: {
    backgroundColor: '#ff6b9d',
    borderRadius: '999px',
    height: '12px',
    transition: 'width 0.3s ease',
  },
  goalDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  goalFooter: {
    fontSize: '0.9rem',
    color: '#555',
    marginTop: '0.5rem',
  },
  debtCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  debtName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  debtDetails: {
    display: 'flex',
    gap: '2rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#888',
  },
};

export default Dashboard;