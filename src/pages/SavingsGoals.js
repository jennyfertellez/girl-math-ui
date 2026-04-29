import React, { useEffect, useState } from 'react';
import { getSavingsGoals, addSavingsGoal, deleteSavingsGoal, getSavingsProjections } from '../services/api';

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [projections, setProjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  const handleSubmit = () => {
    const goal = {
      goalName: form.goalName,
      targetAmount: parseFloat(form.targetAmount),
      currentSavings: parseFloat(form.currentSavings),
      monthlyContribution: parseFloat(form.monthlyContribution),
    };
    addSavingsGoal(goal).then(() => {
      fetchData();
      setShowForm(false);
      setForm({
        goalName: '',
        targetAmount: '',
        currentSavings: '',
        monthlyContribution: '',
      });
    });
  };

  const handleDelete = (id) => {
    deleteSavingsGoal(id).then(() => fetchData());
  };

  const getProjection = (goalName) => {
    return projections.find((p) => p.goalName === goalName);
  };

  if (loading) return <div style={styles.loading}>Loading your savings goals...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Savings Goals 🏦</h1>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add a New Savings Goal</h3>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              name="goalName"
              placeholder="Goal name (e.g. Home Down Payment)"
              value={form.goalName}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="targetAmount"
              placeholder="Target amount ($)"
              type="number"
              value={form.targetAmount}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="currentSavings"
              placeholder="Current savings ($)"
              type="number"
              value={form.currentSavings}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="monthlyContribution"
              placeholder="Monthly contribution ($)"
              type="number"
              value={form.monthlyContribution}
              onChange={handleChange}
            />
          </div>
          <button style={styles.submitButton} onClick={handleSubmit}>
            Save Goal
          </button>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={styles.empty}>
          No savings goals yet. Click "Add Goal" to get started!
        </div>
      ) : (
        goals.map((goal) => {
          const projection = getProjection(goal.goalName);
          return (
            <div key={goal.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.goalName}>{goal.goalName}</div>
                <div style={styles.targetAmount}>${goal.targetAmount.toLocaleString()}</div>
              </div>

              {projection && (
                <>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${projection.percentComplete}%`,
                      }}
                    />
                  </div>
                  <div style={styles.progressLabel}>
                    <span>{projection.percentComplete}% complete</span>
                    <span>${projection.remainingAmount.toLocaleString()} remaining</span>
                  </div>
                  <div style={styles.projectionDetails}>
                    <span>💰 Saved: <strong>${goal.currentSavings.toLocaleString()}</strong></span>
                    <span>📅 Monthly: <strong>${goal.monthlyContribution.toLocaleString()}</strong></span>
                    <span>🎯 Done by: <strong>{projection.projectedDate}</strong></span>
                    <span>⏳ <strong>{projection.monthsRemaining} months</strong> away</span>
                  </div>
                </>
              )}

              <button style={styles.deleteButton} onClick={() => handleDelete(goal.id)}>
                Remove Goal
              </button>
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
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    color: '#ff6b9d',
  },
  addButton: {
    backgroundColor: '#ff6b9d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  form: {
    backgroundColor: '#fff0f6',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  formTitle: {
    color: '#ff6b9d',
    marginBottom: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitButton: {
    backgroundColor: '#ff6b9d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  goalName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333',
  },
  targetAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff6b9d',
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
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '1rem',
  },
  projectionDetails: {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.9rem',
    color: '#555',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#ff4d4d',
    border: '1px solid #ff4d4d',
    borderRadius: '6px',
    padding: '0.4rem 1rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
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

export default SavingsGoals;