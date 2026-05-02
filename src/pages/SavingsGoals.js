import React, { useEffect, useState } from 'react';
import { getSavingsGoals, addSavingsGoal, deleteSavingsGoal, updateSavingsGoal, getSavingsProjections } from '../services/api';

function SavingsGoals({ theme }) {
  const [goals, setGoals] = useState([]);
  const [projections, setProjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [form, setForm] = useState({
    goalName: '',
    targetAmount: '',
    currentSavings: '',
    monthlyContribution: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([getSavingsGoals(), getSavingsProjections()])
      .then(([goalsRes, projectionsRes]) => {
        setGoals(goalsRes.data);
        setProjections(projectionsRes.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setForm({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      currentSavings: goal.currentSavings,
      monthlyContribution: goal.monthlyContribution,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    const goal = {
      goalName: form.goalName,
      targetAmount: parseFloat(form.targetAmount),
      currentSavings: parseFloat(form.currentSavings),
      monthlyContribution: parseFloat(form.monthlyContribution),
    };

    const action = editingGoal
      ? updateSavingsGoal(editingGoal.id, goal)
      : addSavingsGoal(goal);

    action.then(() => {
      fetchData();
      handleCancel();
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
    setForm({
      goalName: '',
      targetAmount: '',
      currentSavings: '',
      monthlyContribution: '',
    });
  };

  const handleDelete = (id, goalName) => {
    if (window.confirm(`Are you sure you want to remove "${goalName}"? This cannot be undone.`)) {
      deleteSavingsGoal(id).then(() => fetchData());
    }
  };

  const getProjection = (goalName) => {
    return projections.find((p) => p.goalName === goalName);
  };

  if (loading) return (
    <div style={{ ...styles.loading, color: theme.textMuted }}>
      Loading your savings goals...
    </div>
  );

  return (
    <div style={{ ...styles.container, fontFamily: "'Poppins', sans-serif" }}>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: theme.primary }}>Savings Goals 🏦</h1>
        <button
          style={{ ...styles.addButton, backgroundColor: theme.primary, color: theme.textLight }}
          onClick={() => { handleCancel(); setShowForm(!showForm); }}
        >
          {showForm && !editingGoal ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {showForm && (
        <div style={{ ...styles.form, backgroundColor: theme.accentLight, border: `1px solid ${theme.border}` }}>
          <h3 style={{ ...styles.formTitle, color: theme.primary }}>
            {editingGoal ? `✏️ Editing: ${editingGoal.goalName}` : '➕ Add a New Savings Goal'}
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Goal Name</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="goalName"
                placeholder="e.g. Home Down Payment"
                value={form.goalName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Target Amount ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="targetAmount"
                placeholder="e.g. 50000"
                type="number"
                value={form.targetAmount}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Current Savings ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="currentSavings"
                placeholder="e.g. 5000"
                type="number"
                value={form.currentSavings}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Monthly Contribution ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="monthlyContribution"
                placeholder="e.g. 500"
                type="number"
                value={form.monthlyContribution}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={styles.formButtons}>
            <button
              style={{ ...styles.submitButton, backgroundColor: theme.primary, color: theme.textLight }}
              onClick={handleSubmit}
            >
              {editingGoal ? 'Update Goal' : 'Save Goal'}
            </button>
            <button
              style={{ ...styles.cancelButton, color: theme.primary, border: `1px solid ${theme.primary}` }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ ...styles.empty, color: theme.textMuted }}>
          No savings goals yet. Click "Add Goal" to get started! 💪
        </div>
      ) : (
        goals.map((goal) => {
          const projection = getProjection(goal.goalName);
          return (
            <div
              key={goal.id}
              style={{
                ...styles.card,
                backgroundColor: theme.cardBackground,
                boxShadow: hoveredCard === goal.id ? theme.shadowHover : theme.shadow,
                transform: hoveredCard === goal.id ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
                border: `1px solid ${theme.border}`,
              }}
              onMouseEnter={() => setHoveredCard(goal.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardTop}>
                <div style={{ ...styles.goalName, color: theme.textPrimary }}>
                  🎯 {goal.goalName}
                </div>
                <div style={{ ...styles.targetAmount, color: theme.primary }}>
                  ${goal.targetAmount.toLocaleString()}
                </div>
              </div>

              {projection && (
                <>
                  <div style={{ ...styles.progressBar, backgroundColor: theme.border }}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${projection.percentComplete}%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                  <div style={styles.progressLabel}>
                    <span style={{ color: theme.textSecondary }}>
                      {projection.percentComplete}% complete
                    </span>
                    <span style={{ color: theme.textSecondary }}>
                      ${projection.remainingAmount.toLocaleString()} remaining
                    </span>
                  </div>
                  <div style={styles.projectionDetails}>
                    <div style={{ ...styles.projectionItem, backgroundColor: theme.accentLight }}>
                      <span style={{ color: theme.textMuted, fontSize: '0.75rem' }}>SAVED</span>
                      <span style={{ color: theme.primary, fontWeight: '600' }}>
                        ${goal.currentSavings.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ ...styles.projectionItem, backgroundColor: theme.accentLight }}>
                      <span style={{ color: theme.textMuted, fontSize: '0.75rem' }}>MONTHLY</span>
                      <span style={{ color: theme.primary, fontWeight: '600' }}>
                        ${goal.monthlyContribution.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ ...styles.projectionItem, backgroundColor: theme.accentLight }}>
                      <span style={{ color: theme.textMuted, fontSize: '0.75rem' }}>DONE BY</span>
                      <span style={{ color: theme.primary, fontWeight: '600' }}>
                        {projection.projectedDate === 'Goal already reached!'
                          ? '🎉 Reached!'
                          : projection.projectedDate}
                      </span>
                    </div>
                    <div style={{ ...styles.projectionItem, backgroundColor: theme.accentLight }}>
                      <span style={{ color: theme.textMuted, fontSize: '0.75rem' }}>MONTHS LEFT</span>
                      <span style={{ color: theme.primary, fontWeight: '600' }}>
                        {projection.monthsRemaining}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div style={styles.cardActions}>
                <button
                  style={{ ...styles.editButton, backgroundColor: theme.primary, color: theme.textLight }}
                  onClick={() => handleEdit(goal)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{ ...styles.deleteButton, color: theme.danger, border: `1px solid ${theme.danger}` }}
                  onClick={() => handleDelete(goal.id, goal.goalName)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  addButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  form: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    fontWeight: '600',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
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
  formButtons: {
    display: 'flex',
    gap: '1rem',
  },
  submitButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1rem',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  goalName: {
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  targetAmount: {
    fontSize: '1.5rem',
    fontWeight: '700',
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
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  projectionDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  projectionItem: {
    borderRadius: '10px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
  },
  editButton: {
    border: 'none',
    borderRadius: '6px',
    padding: '0.4rem 1rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderRadius: '6px',
    padding: '0.4rem 1rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
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

export default SavingsGoals;