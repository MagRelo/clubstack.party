import React, { useState, useContext, useEffect } from 'react';
import { Link, globalHistory } from '@reach/router';

// import { GiHeartPlus } from 'react-icons/gi';
import { FaBars } from 'react-icons/fa';

import { AuthContext } from '../App';
import { NavLink } from 'components/random';

function Header() {
  const { activeSession, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return globalHistory.listen((action) => {
      setMenuOpen(false);
    });
  }, []);

  return (
    <header>
      {/* <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div> */}

      <div className="header-grid">
        <div className="header-container">
          <button
            className="btn button-unstyled menu-button"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <FaBars />
          </button>

          <Link to="/">
            <span>
              {/* <span className="header-title">The Skills of Reading</span> */}
            </span>
          </Link>
        </div>

        <div className="header-container">
          {/* <span className="header-tagline">User-Generated Communities</span> */}
        </div>

        <div className="header-container desktop-menu">
          <ul className="nav-list">
            {/* <li>
              <NavLink to="/leaderboard">Front Page</NavLink>
            </li> */}

            {!activeSession ? (
              <li style={{ float: 'right' }}>
                <NavLink to="/login">Sign In</NavLink>
              </li>
            ) : null}

            {activeSession && user.type === 'Admin' ? (
              <li style={{ float: 'right' }}>
                <NavLink to="/admin">Admin</NavLink>
              </li>
            ) : null}

            {activeSession && user.type === 'Standard' ? (
              <li style={{ float: 'right' }}>
                <NavLink to="/account">Account</NavLink>
              </li>
            ) : null}

            {activeSession ? (
              <li style={{ float: 'right' }}>
                <NavLink to="/dashboard">Home</NavLink>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="header-container mobile-menu">
          {menuOpen ? (
            <ul className="nav-list">
              {!activeSession ? (
                <li>
                  <NavLink to="/login">Sign In</NavLink>
                </li>
              ) : null}

              {activeSession ? (
                <li>
                  <NavLink to="/dashboard">Home</NavLink>
                </li>
              ) : null}

              {activeSession && user.type === 'Admin' ? (
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              ) : null}

              {activeSession && user.type === 'Standard' ? (
                <li>
                  <NavLink to="/account">Account</NavLink>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
