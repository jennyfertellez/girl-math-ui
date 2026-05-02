import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ theme, isDarkMode, setIsDarkMode }) {
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/debts', label: 'My Debts' },
    { path: '/savings', label: 'Savings Goals' },
    { path: '/snowball', label: 'Snowball Calculator' },
  ];

  return (
    <nav style={{ ...styles.nav, backgroundColor: theme.navBackground }}>
      <Link to="/" style={styles.logoLink}>
        <div style={{ ...styles.logo, color: theme.accent }}>
          💸 GirlMath
        </div>
      </Link>

      <div style={styles.links}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const isHovered = hoveredLink === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                color: theme.textLight,
                borderBottom: isActive
                  ? `2px solid ${theme.accent}`
                  : '2px solid transparent',
                opacity: isHovered ? 0.8 : 1,
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => setHoveredLink(link.path)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
            </Link>
          );
        })}

        <button
          style={{
            ...styles.toggleButton,
            backgroundColor: isDarkMode ? theme.accent : 'transparent',
            color: isDarkMode ? theme.primary : theme.textLight,
            border: `1px solid ${theme.accent}`,
          }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    paddingBottom: '4px',
  },
  toggleButton: {
    borderRadius: '20px',
    padding: '0.4rem 1rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default Navbar;