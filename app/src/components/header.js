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
              <span className="header-title">ClubStack</span>
            </span>
          </Link>
        </div>

        <div className="header-container">
          <span className="header-tagline">User-Generated Communities</span>
        </div>

        <div className="header-container desktop-menu">
          <NavList
            activeSession={activeSession}
            userType={user.type}
            subdomainActive={!!user.subdomain}
          />
        </div>

        <div className="header-container mobile-menu">
          {menuOpen ? (
            <NavList
              activeSession={activeSession}
              userType={user.type}
              subdomainActive={!!user.subdomain}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

function NavList({ activeSession, userType, subdomainActive }) {
  // console.log((activeSession, userType));
  return (
    <ul className="nav-list">
      {!activeSession ? (
        <li>
          <NavLink to="/login">Sign In</NavLink>
        </li>
      ) : null}

      {activeSession && userType === 'Admin' ? (
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
      ) : null}

      {activeSession && userType === 'Standard' ? (
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
      ) : null}

      {activeSession && subdomainActive ? (
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
      ) : null}

      {activeSession ? (
        <li>
          <NavLink to="/clubs">Communities</NavLink>
        </li>
      ) : null}
    </ul>
  );
}

export default Header;
