import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';

function Dashboard({ theme }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  if (loading) return (
    <div style={{ ...styles.loading, color: theme.textMuted }}>
      Loading your financial summary...
    </div>
  );

  if (!summary) return (
    <div style={{ ...styles.loading, color: theme.textMuted }}>
      No data found. Add your debts and savings goals to get started!
    </div>
  );

  // Calculate debt free date
  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + summary.monthsToDebtFree);
  const debtFreeDateString = debtFreeDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const summaryCards = [
    { label: 'Total Debt', value: `$${summary.totalDebt.toLocaleString()}`, emoji: '💳' },
    { label: 'Monthly Minimums', value: `$${summary.totalMinimumPayments.toLocaleString()}`, emoji: '📅' },
    { label: 'Months to Debt Free', value: summary.monthsToDebtFree, emoji: '🎯' },
    { label: 'Total Saved', value: `$${summary.totalSaved.toLocaleString()}`, emoji: '🏦' },
  ];

  return (
    <div style={{ ...styles.container, fontFamily: "'Poppins', sans-serif" }}>

      {/* Debt Free Banner */}
      <div style={{
        ...styles.banner,
        backgroundColor: theme.primary,
        color: theme.textLight,
      }}>
        <div style={styles.bannerEmoji}>🎉</div>
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>
            At your current pace, you'll be debt free by
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: theme.accent }}>
            {debtFreeDateString}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>
            That's only {summary.monthsToDebtFree} months away. You've got this! 💪
          </div>
        </div>
      </div>

      <h1 style={{ ...styles.title, color: theme.primary }}>
        Your Financial Dashboard ✨
      </h1>

      {/* Summary Cards */}
      <div style={styles.cardRow}>
        {summaryCards.map((card, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              backgroundColor: theme.cardBackground,
              boxShadow: hoveredCard === index ? theme.shadowHover : theme.shadow,
              transform: hoveredCard === index ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardEmoji}>{card.emoji}</div>
            <div style={{ ...styles.cardLabel, color: theme.textMuted }}>{card.label}</div>
            <div style={{ ...styles.cardValue, color: theme.primary }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Savings Goals */}
      <h2 style={{ ...styles.subtitle, color: theme.textPrimary }}>
        Savings Goals Progress 🏦
      </h2>
      {summary.savingsProjections.map((goal, index) => (
        <div
          key={index}
          style={{
            ...styles.goalCard,
            backgroundColor: theme.cardBackground,
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={styles.goalHeader}>
            <span style={{ ...styles.goalName, color: theme.textPrimary }}>
              {goal.goalName}
            </span>
            <span style={{ ...styles.goalPercent, color: theme.primary }}>
              {goal.percentComplete}% complete
            </span>
          </div>
          <div style={{ ...styles.progressBar, backgroundColor: theme.border }}>
            <div style={{
              ...styles.progressFill,
              width: `${goal.percentComplete}%`,
              backgroundColor: theme.primary,
            }} />
          </div>
          <div style={styles.goalDetails}>
            <span style={{ color: theme.textSecondary }}>
              ${goal.currentSavings.toLocaleString()} saved
            </span>
            <span style={{ color: theme.textSecondary }}>
              ${goal.targetAmount.toLocaleString()} goal
            </span>
          </div>
          <div style={{ ...styles.goalFooter, color: theme.textSecondary }}>
            🏠 Projected date: <strong>{goal.projectedDate}</strong> ({goal.monthsRemaining} months away)
          </div>
        </div>
      ))}

      {/* Debts */}
      <h2 style={{ ...styles.subtitle, color: theme.textPrimary }}>
        Your Debts 💳
      </h2>
      {summary.debts.map((debt, index) => (
        <div
          key={index}
          style={{
            ...styles.debtCard,
            backgroundColor: theme.cardBackground,
            boxShadow: theme.shadow,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ ...styles.debtName, color: theme.textPrimary }}>{debt.name}</div>
          <div style={styles.debtDetails}>
            <span style={{ color: theme.textSecondary }}>
              Balance: <strong>${debt.balance.toLocaleString()}</strong>
            </span>
            <span style={{ color: theme.textSecondary }}>
              APR: <strong>{debt.interestRate}%</strong>
            </span>
            <span style={{ color: theme.textSecondary }}>
              Minimum: <strong>${debt.minimumPayment}</strong>
            </span>
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
  },
  banner: {
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  bannerEmoji: {
    fontSize: '3rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  subtitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
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
    borderRadius: '16px',
    padding: '1.5rem',
    textAlign: 'center',
    cursor: 'default',
  },
  cardEmoji: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  cardLabel: {
    fontSize: '0.8rem',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: '1.4rem',
    fontWeight: '700',
  },
  goalCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  goalName: {
    fontWeight: '600',
    fontSize: '1.05rem',
  },
  goalPercent: {
    fontWeight: '600',
  },
  progressBar: {
    borderRadius: '999px',
    height: '10px',
    marginBottom: '0.5rem',
  },
  progressFill: {
    borderRadius: '999px',
    height: '10px',
    transition: 'width 0.3s ease',
  },
  goalDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
  },
  goalFooter: {
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  debtCard: {
    borderRadius: '16px',
    padding: '1.25rem',
    marginBottom: '0.75rem',
  },
  debtName: {
    fontWeight: '600',
    fontSize: '1.05rem',
    marginBottom: '0.5rem',
  },
  debtDetails: {
    display: 'flex',
    gap: '2rem',
    fontSize: '0.9rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem',
  },
};

export default Dashboard;