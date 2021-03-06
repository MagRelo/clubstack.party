import React from 'react';
import { NavLink } from 'components/random';

function Footer(props) {
  return (
    <footer>
      {/* <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
       */}
      <div className="container">
        <div className="grid grid-2">
          <div style={{ zIndex: 1 }}>
            <div className="footer-logo">
              <span>
                <span className="footer-title">ClubStack</span>
              </span>
            </div>
            <p>User-Generated Communities</p>
          </div>

          <div style={{ zIndex: 1 }}>
            <div
              style={{
                height: '70px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h4 className="links-title">
                <span>Links</span>
              </h4>
            </div>

            <div className="footer-list justify-content-between d-flex">
              <ul className="list-unstyled w-100">
                <li>
                  <NavLink to="/login">Sign In</NavLink>
                  <NavLink to="/about">About</NavLink>
                  <NavLink to="/terms">Terms</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <div className="container">
          <div
            className="copyright"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <span>Incentive&#8201;Exchange | 2020</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
