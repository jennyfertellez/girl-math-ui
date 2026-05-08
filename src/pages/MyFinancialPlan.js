import React, { useEffect, useState } from 'react';
import { getPreferences, updatePreferences } from '../services/api';

function MyFinancialPlan({ theme }) {
  const [preferences, setPreferences] = useState({
    paycheckDayOne: '',
    paycheckDayTwo: '',
    paycheckFrequency: 'BIMONTHLY',
    preferredDebtMethod: 'SNOWBALL',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences().then((res) => {
      setPreferences({
        paycheckDayOne: res.data.paycheckDayOne || '',
        paycheckDayTwo: res.data.paycheckDayTwo || '',
        paycheckFrequency: res.data.paycheckFrequency || 'BIMONTHLY',
        preferredDebtMethod: res.data.preferredDebtMethod || 'SNOWBALL',
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    updatePreferences({
      paycheckDayOne: preferences.paycheckDayOne ? parseInt(preferences.paycheckDayOne) : null,
      paycheckDayTwo: preferences.paycheckDayTwo ? parseInt(preferences.paycheckDayTwo) : null,
      paycheckFrequency: preferences.paycheckFrequency,
      preferredDebtMethod: preferences.preferredDebtMethod,
    }).then(() => setSaved(true));
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: theme.textMuted }}>
      Loading your financial plan...
    </div>
  );

  return (
    <div style={{ ...styles.container, fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ ...styles.title, color: theme.primary }}>My Financial Plan</h1>
      <p style={{ ...styles.subtitle, color: theme.textSecondary }}>
        Set up your paycheck schedule and preferred debt strategy so we can
          build you a personalized monthly action plan.
      </p>

      {/* Paycheck Settings */}
      <div style={{
        ...styles.card,
        backgroundColor: theme.cardBackground,
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
      }}>
        <h2 style={{ ...styles.sectionTitle, color: theme.primary }}>
          💵 Paycheck Schedule
        </h2>
        <p style={{ ...styles.sectionSubtitle, color: theme.textMuted }}>
          Tell us when you get paid so we can suggest the best time to make
          payments for your credit score.
        </p>

        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>
              Pay Frequency
            </label>
            <select
              style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              name="paycheckFrequency"
              value={preferences.paycheckFrequency}
              onChange={handleChange}
            >
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-Weekly (every 2 weeks)</option>
              <option value="BIMONTHLY">Bi-Monthly (1st and 15th)</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: theme.textSecondary }}>
              First Paycheck Day (day of month)
            </label>
            <input
              style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              name="paycheckDayOne"
              placeholder="e.g. 1"
              type="number"
              min="1"
              max="31"
              value={preferences.paycheckDayOne}
              onChange={handleChange}
            />
          </div>

          {(preferences.paycheckFrequency === 'BIMONTHLY') && (
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>
                Second Paycheck Day (day of month)
              </label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="paycheckDayTwo"
                placeholder="e.g. 15"
                type="number"
                min="1"
                max="31"
                value={preferences.paycheckDayTwo}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Debt Method Settings */}
      <div style={{
        ...styles.card,
        backgroundColor: theme.cardBackground,
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`,
      }}>
        <h2 style={{ ...styles.sectionTitle, color: theme.primary }}>
          🎯 Preferred Debt Method
        </h2>
        <p style={{ ...styles.sectionSubtitle, color: theme.textMuted }}>
          Choose your debt payoff strategy. This will be used to generate
          your monthly action plan.
        </p>

        <div style={styles.methodToggle}>
          <div
            style={{
              ...styles.methodCard,
              border: preferences.preferredDebtMethod === 'SNOWBALL'
                ? `2px solid ${theme.primary}`
                : `2px solid ${theme.border}`,
              backgroundColor: preferences.preferredDebtMethod === 'SNOWBALL'
                ? theme.accentLight
                : theme.cardBackground,
            }}
            onClick={() => {
              setPreferences({ ...preferences, preferredDebtMethod: 'SNOWBALL' });
              setSaved(false);
            }}
          >
            <div style={styles.methodEmoji}>❄️</div>
            <div style={{ ...styles.methodName, color: theme.primary }}>Snowball</div>
            <div style={{ ...styles.methodDesc, color: theme.textMuted }}>
              Pay smallest balance first. Faster wins, great for motivation.
            </div>
            {preferences.preferredDebtMethod === 'SNOWBALL' && (
              <div style={{ color: theme.primary, fontWeight: '600', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                ✅ Selected
              </div>
            )}
          </div>

          <div
            style={{
              ...styles.methodCard,
              border: preferences.preferredDebtMethod === 'AVALANCHE'
                ? `2px solid ${theme.primary}`
                : `2px solid ${theme.border}`,
              backgroundColor: preferences.preferredDebtMethod === 'AVALANCHE'
                ? theme.accentLight
                : theme.cardBackground,
            }}
            onClick={() => {
              setPreferences({ ...preferences, preferredDebtMethod: 'AVALANCHE' });
              setSaved(false);
            }}
          >
            <div style={styles.methodEmoji}>🌊</div>
            <div style={{ ...styles.methodName, color: theme.primary }}>Avalanche</div>
            <div style={{ ...styles.methodDesc, color: theme.textMuted }}>
              Pay highest interest first. Saves the most money overall.
            </div>
            {preferences.preferredDebtMethod === 'AVALANCHE' && (
              <div style={{ color: theme.primary, fontWeight: '600', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                ✅ Selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={styles.saveRow}>
        {saved && (
          <span style={{ color: '#10b981', fontWeight: '600', fontSize: '0.95rem' }}>
            ✅ Financial Plan saved!
          </span>
        )}
        <button
          style={{ ...styles.saveButton, backgroundColor: theme.primary, color: theme.textLight }}
          onClick={handleSave}
        >
          Save
        </button>
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
    marginBottom: '2rem',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  },
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: 'white',
  },
  methodToggle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  methodCard: {
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  methodEmoji: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  methodName: {
    fontWeight: '700',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  methodDesc: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
  },
  saveRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  saveButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default MyFinancialPlan;