import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💸 GirlMath</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/debts" style={styles.link}>My Debts</Link>
        <Link to="/savings" style={styles.link}>Savings Goals</Link>
        <Link to="/snowball" style={styles.link}>Snowball Calculator</Link>
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
    backgroundColor: '#ff6b9d',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
  },
};

export default Navbar;