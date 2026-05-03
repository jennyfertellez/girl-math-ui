import React, { useEffect, useState } from 'react';
import { getDebts, addDebt, deleteDebt, updateDebt } from '../services/api';

function Debts({ theme }) {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [activeTab, setActiveTab] = useState('active');
  const [form, setForm] = useState({
    name: '',
    balance: '',
    interestRate: '',
    minimumPayment: '',
    monthlyBudget: '',
    debtType: 'CREDIT_CARD',
    creditLimit: '',
    customDebtType: '',
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

  const handleEdit = (debt) => {
    setEditingDebt(debt);
    setForm({
      name: debt.name,
      balance: debt.balance,
      interestRate: debt.interestRate,
      minimumPayment: debt.minimumPayment,
      monthlyBudget: debt.monthlyBudget,
      debtType: debt.debtType,
      creditLimit: debt.creditLimit || '',
      customDebtType: debt.customDebtType || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('Please enter a debt name.');
      return;
    }
    if (!form.balance || isNaN(parseFloat(form.balance))) {
      alert('Please enter a valid balance.');
      return;
    }
    if (!form.interestRate && form.interestRate !== 0) {
      alert('Please enter a valid interest rate.');
      return;
    }
    if (!form.minimumPayment || isNaN(parseFloat(form.minimumPayment))) {
      alert('Please enter a valid minimum payment.');
      return;
    }
    if (!form.monthlyBudget || isNaN(parseFloat(form.monthlyBudget))) {
      alert('Please enter a valid monthly budget.');
      return;
    }
    if (form.debtType === 'OTHER' && !form.customDebtType.trim()) {
      alert('Please describe your debt type.');
      return;
    }

    const debt = {
      name: form.name,
      balance: parseFloat(form.balance),
      interestRate: parseFloat(form.interestRate),
      minimumPayment: parseFloat(form.minimumPayment),
      monthlyBudget: parseFloat(form.monthlyBudget),
      debtType: form.debtType,
      creditLimit: form.creditLimit ? parseFloat(form.creditLimit) : null,
      customDebtType: form.debtType === 'OTHER' ? form.customDebtType : null,
    };

    const action = editingDebt
      ? updateDebt(editingDebt.id, debt)
      : addDebt(debt);

    action.then(() => {
      fetchDebts();
      handleCancel();
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDebt(null);
    setForm({
      name: '',
      balance: '',
      interestRate: '',
      minimumPayment: '',
      monthlyBudget: '',
      debtType: 'CREDIT_CARD',
      creditLimit: '',
      customDebtType: '',
    });
  };

  const handleDelete = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  const confirmDelete = () => {
    deleteDebt(deleteModal.id).then(() => {
      fetchDebts();
      setDeleteModal({ show: false, id: null, name: '' });
    });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, id: null, name: '' });
  };

  const handleMarkPaid = (debt) => {
    if (window.confirm(`🎉 Congrats on paying off "${debt.name}"! Mark it as paid?`)) {
       updateDebt(debt.id, { ...debt, paidOff: true }).then(() => fetchDebts());
     }
  };

  const debtTypeLabel = (debt) => {
    const labels = {
      CREDIT_CARD: '💳 Credit Card',
      STUDENT_LOAN: '🎓 Student Loan',
      MEDICAL: '🏥 Medical',
      OTHER: `📋 ${debt.customDebtType || 'Other'}`,
    };
    return labels[debt.debtType] || debt.debtType;
  };

  const activeDebts = debts.filter((d) => !d.paidOff);
  const paidDebts = debts.filter((d) => d.paidOff);

  const groupedDebts = activeDebts.reduce((acc, debt) => {
    const key = debt.debtType === 'OTHER' && debt.customDebtType
      ? `OTHER_${debt.customDebtType}`
      : debt.debtType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(debt);
    return acc;
  }, {});

  if (loading) return (
    <div style={{ ...styles.loading, color: theme.textMuted }}>
      Loading your debts...
    </div>
  );

  return (
    <div style={{ ...styles.container, fontFamily: "'Poppins', sans-serif" }}>
      <div style={styles.header}>
              <h1 style={{ ...styles.title, color: theme.primary }}>My Debts 💳</h1>
              <button
                style={{ ...styles.addButton, backgroundColor: theme.primary, color: theme.textLight }}
                onClick={() => { handleCancel(); setShowForm(!showForm); }}
              >
                {showForm && !editingDebt ? 'Cancel' : '+ Add Debt'}
              </button>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              <button
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === 'active'
                    ? `3px solid ${theme.primary}`
                    : '3px solid transparent',
                  color: activeTab === 'active' ? theme.primary : theme.textMuted,
                  fontWeight: activeTab === 'active' ? '700' : '400',
                }}
                onClick={() => setActiveTab('active')}
              >
                Active Debts ({activeDebts.length})
              </button>
              <button
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === 'paid'
                    ? `3px solid ${theme.primary}`
                    : '3px solid transparent',
                  color: activeTab === 'paid' ? theme.primary : theme.textMuted,
                  fontWeight: activeTab === 'paid' ? '700' : '400',
                }}
                onClick={() => setActiveTab('paid')}
              >
                Paid Off 🎉 ({paidDebts.length})
              </button>
            </div>

      {showForm && (
        <div style={{ ...styles.form, backgroundColor: theme.accentLight, border: `1px solid ${theme.border}` }}>
          <h3 style={{ ...styles.formTitle, color: theme.primary }}>
            {editingDebt ? `✏️ Editing: ${editingDebt.name}` : '➕ Add a New Debt'}
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Debt Name</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="name"
                placeholder="e.g. Chase Credit Card"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Current Balance ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="balance"
                placeholder="e.g. 2500"
                type="number"
                value={form.balance}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Interest Rate (APR %)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="interestRate"
                placeholder="e.g. 24.99"
                type="number"
                value={form.interestRate}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Minimum Payment ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="minimumPayment"
                placeholder="e.g. 65"
                type="number"
                value={form.minimumPayment}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Monthly Budget ($)</label>
              <input
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="monthlyBudget"
                placeholder="e.g. 200"
                type="number"
                value={form.monthlyBudget}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: theme.textSecondary }}>Debt Type</label>
              <select
                style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                name="debtType"
                value={form.debtType}
                onChange={handleChange}
              >
                <option value="CREDIT_CARD">💳 Credit Card</option>
                <option value="STUDENT_LOAN">🎓 Student Loan</option>
                <option value="MEDICAL">🏥 Medical</option>
                <option value="OTHER">📋 Other</option>
              </select>
            </div>
            {form.debtType === 'CREDIT_CARD' && (
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: theme.textSecondary }}>Credit Limit ($)</label>
                <input
                  style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                  name="creditLimit"
                  placeholder="e.g. 5000"
                  type="number"
                  value={form.creditLimit}
                  onChange={handleChange}
                />
              </div>
            )}
            {form.debtType === 'OTHER' && (
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: theme.textSecondary }}>
                  Describe Your Debt
                </label>
                <input
                  style={{ ...styles.input, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                  name="customDebtType"
                  placeholder="e.g. Personal Loan, Car Repair"
                  value={form.customDebtType}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          <div style={styles.formButtons}>
            <button
              style={{ ...styles.submitButton, backgroundColor: theme.primary, color: theme.textLight }}
              onClick={handleSubmit}
            >
              {editingDebt ? 'Update Debt' : 'Save Debt'}
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

      {activeTab === 'active' ? (
              activeDebts.length === 0 ? (
                <div style={{ ...styles.empty, color: theme.textMuted }}>
                  No active debts! You're crushing it! 🎉
                </div>
              ) : (
                Object.entries(groupedDebts).map(([type, typeDebts]) => (
                  <div key={type} style={styles.group}>
                    <h2 style={{ ...styles.groupTitle, color: theme.textSecondary }}>
                      {debtTypeLabel(typeDebts[0])}
                    </h2>
                    {typeDebts.map((debt) => (
                      <div
                        key={debt.id}
                        style={{
                          ...styles.card,
                          backgroundColor: theme.cardBackground,
                          boxShadow: hoveredCard === debt.id ? theme.shadowHover : theme.shadow,
                          transform: hoveredCard === debt.id ? 'translateY(-4px)' : 'translateY(0)',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${theme.border}`,
                        }}
                        onMouseEnter={() => setHoveredCard(debt.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div style={styles.cardTop}>
                          <div>
                            <div style={{ ...styles.debtName, color: theme.textPrimary }}>{debt.name}</div>
                            <div style={{ ...styles.debtMeta, color: theme.textMuted }}>
                              APR: {debt.interestRate}% • Min: ${debt.minimumPayment}/mo • Budget: ${debt.monthlyBudget}/mo
                              {debt.debtType === 'CREDIT_CARD' && debt.creditLimit && (
                                <div style={{
                                  marginTop: '0.4rem',
                                  backgroundColor: theme.accentLight,
                                  color: theme.primary,
                                  borderRadius: '6px',
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  display: 'inline-block',
                                }}>
                                  💳 Available: ${(debt.creditLimit - debt.balance).toLocaleString()} of ${debt.creditLimit.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ ...styles.balance, color: theme.primary }}>
                            ${debt.balance.toLocaleString()}
                          </div>
                        </div>
                        <div style={styles.cardActions}>
                          <button
                            style={{ ...styles.paidButton, backgroundColor: '#10b981', color: 'white' }}
                            onClick={() => handleMarkPaid(debt)}
                          >
                            ✅ Mark Paid
                          </button>
                          <button
                            style={{ ...styles.editButton, backgroundColor: theme.primary, color: theme.textLight }}
                            onClick={() => handleEdit(debt)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            style={{ ...styles.deleteButton, color: theme.danger, border: `1px solid ${theme.danger}` }}
                            onClick={() => handleDelete(debt.id, debt.name)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )
            ) : (
              paidDebts.length === 0 ? (
                <div style={{ ...styles.empty, color: theme.textMuted }}>
                  No paid off debts yet — keep going! 💪
                </div>
              ) : (
                paidDebts.map((debt) => (
                  <div
                    key={debt.id}
                    style={{
                      ...styles.card,
                      backgroundColor: theme.cardBackground,
                      boxShadow: theme.shadow,
                      border: `2px solid #10b981`,
                      opacity: 0.85,
                    }}
                  >
                    <div style={styles.cardTop}>
                      <div>
                        <div style={{ ...styles.debtName, color: theme.textPrimary }}>
                          {debt.name}
                        </div>
                        <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
                          ✅ Paid Off — Original balance: ${debt.balance.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ fontSize: '2rem' }}>🎉</div>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        style={{ ...styles.deleteButton, color: theme.danger, border: `1px solid ${theme.danger}` }}
                        onClick={() => handleDelete(debt.id, debt.name)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={styles.modalOverlay}>
          <div style={{
            ...styles.modal,
            backgroundColor: theme.cardBackground,
            boxShadow: theme.shadowHover,
          }}>
            <div style={styles.modalEmoji}>🗑️</div>
            <h3 style={{ ...styles.modalTitle, color: theme.primary }}>
              Remove Debt
            </h3>
            <p style={{ ...styles.modalMessage, color: theme.textSecondary }}>
              Are you sure you want to remove <strong>"{deleteModal.name}"</strong>? This cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalCancel, color: theme.primary, border: `1px solid ${theme.primary}` }}
                onClick={cancelDelete}
              >
                Keep It
              </button>
              <button
                style={{ ...styles.modalConfirm, backgroundColor: theme.danger, color: 'white' }}
                onClick={confirmDelete}
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
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
  group: {
    marginBottom: '1.5rem',
  },
  groupTitle: {
    fontWeight: '600',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.85rem',
  },
  card: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '0.75rem',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  debtName: {
    fontWeight: '600',
    fontSize: '1.05rem',
    marginBottom: '0.25rem',
  },
  debtMeta: {
    fontSize: '0.85rem',
  },
  balance: {
    fontSize: '1.5rem',
    fontWeight: '700',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 31, 69, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  },
  modalEmoji: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
  },
  modalMessage: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  modalCancel: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  modalConfirm: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  },
  tabs: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '1.5rem',
      borderBottom: '1px solid #e8e8e8',
    },
    tab: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: '0.75rem 0',
      fontSize: '1rem',
      cursor: 'pointer',
      fontFamily: "'Poppins', sans-serif",
      transition: 'all 0.2s ease',
    },
    paidButton: {
      border: 'none',
      borderRadius: '6px',
      padding: '0.4rem 1rem',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '500',
      fontFamily: "'Poppins', sans-serif",
    },
};

export default Debts;