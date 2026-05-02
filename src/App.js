import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Debts from './pages/Debts';
import SavingsGoals from './pages/SavingsGoals';
import Snowball from './pages/Snowball';
import Navbar from './components/Navbar';
import { lightTheme, darkTheme } from './theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.background,
        transition: 'background-color 0.3s ease',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <Navbar theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Dashboard theme={theme} />} />
          <Route path="/debts" element={<Debts theme={theme} />} />
          <Route path="/savings" element={<SavingsGoals theme={theme} />} />
          <Route path="/snowball" element={<Snowball theme={theme} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;