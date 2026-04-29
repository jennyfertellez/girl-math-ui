import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Debts from './pages/Debts';
import SavingsGoals from './pages/SavingsGoals';
import Snowball from './pages/Snowball';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/savings" element={<SavingsGoals />} />
        <Route path="/snowball" element={<Snowball />} />
      </Routes>
    </Router>
  );
}

export default App;