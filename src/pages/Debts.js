import React, { useEffect, useState } from 'react';
import { getDebts, addDebt, deleteDebt } from '../services/api';

function Debts() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
    monthlyBudget: '',
    debtType: 'CREDIT_CARD',
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = () => {
    getDebts()
      .then((res) => {
        setDebts(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const debt = {
      name: form.name,
      balance: parseFloat(form.balance),
      interestRate: parseFloat(form.interestRate),
      minimumPayment: parseFloat(form.minimumPayment),
      monthlyBudget: parseFloat(form.monthlyBudget),
      debtType: form.debtType,
    };
    addDebt(debt).then(() => {
      fetchDebts();
      setShowForm(false);
      setForm({
        name: '',
        balance: '',
        interestRate: '',
        minimumPayment: '',
        monthlyBudget: '',
        debtType: 'CREDIT_CARD',
      });
    });
  };

  const handleDelete = (id) => {
    deleteDebt(id).then(() => fetchDebts());
  };

  if (loading) return <div style={styles.loading}>Loading your debts...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Debts 💳</h1>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Debt'}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add a New Debt</h3>
          <div style={styles.formGrid}>
            <input
              style={styles.input}
              name="name"
              placeholder="Debt name (e.g. Chase Credit Card)"
              value={form.name}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="balance"
              placeholder="Current balance ($)"
              type="number"
              value={form.balance}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="interestRate"
              placeholder="Interest rate (e.g. 24.99)"
              type="number"
              value={form.interestRate}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="minimumPayment"
              placeholder="Minimum payment ($)"
              type="number"
              value={form.minimumPayment}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              name="monthlyBudget"
              placeholder="Monthly budget for this debt ($)"
              type="number"
              value={form.monthlyBudget}
              onChange={handleChange}
            />
            <select
              style={styles.input}
              name="debtType"
              value={form.debtType}
              onChange={handleChange}
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="STUDENT_LOAN">Student Loan</option>
              <option value="MEDICAL">Medical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button style={styles.submitButton} onClick={handleSubmit}>
            Save Debt
          </button>
        </div>
      )}

      {debts.length === 0 ? (
        <div style={styles.empty}>
          No debts added yet. Click "Add Debt" to get started!
        </div>
      ) : (
        debts.map((debt) => (
          <div key={debt.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.debtName}>{debt.name}</div>
                <div style={styles.debtType}>{debt.debtType.replace('_', ' ')}</div>
              </div>
              <div style={styles.balance}>${debt.balance.toLocaleString()}</div>
            </div>
            <div style={styles.cardBottom}>
              <span>APR: <strong>{debt.interestRate}%</strong></span>
              <span>Min Payment: <strong>${debt.minimumPayment}</strong></span>
              <span>Monthly Budget: <strong>${debt.monthlyBudget}</strong></span>
              <button style={styles.deleteButton} onClick={() => handleDelete(debt.id)}>
                Remove
              </button>
            </div>
          </div>
        ))
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
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  debtName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333',
  },
  debtType: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '0.25rem',
  },
  balance: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff6b9d',
  },
  cardBottom: {
    display: 'flex',
    gap: '2rem',
    fontSize: '0.9rem',
    color: '#555',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 'auto',
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

export default Debts;