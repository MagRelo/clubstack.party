import React, { useState } from 'react';

import { ImWarning } from 'react-icons/im';

import { Bouncing } from 'components/random';

export default SubdomainForm;

export function SubdomainForm() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('Generate Preview');

  const [buttonDisabled, setButtonDisabled] = useState(true);

  function handleChange(event) {
    setErrorMessage(null);
    setLoading(true);
    setCaption('Testing');

    // test URL?

    // activate button
    setButtonDisabled(false);
    setLoading(false);
    setCaption('Preview');
  }

  return (
    <div className="form-wrapper panel">
      <form name="loginForm">
        <div className="form-group">
          <label htmlFor="substack">Substack</label>
          <input
            type="substack"
            name="substack"
            required={true}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <hr />

        <button className="btn btn-theme" disabled={buttonDisabled}>
          {loading ? (
            <span>
              <Bouncing />
            </span>
          ) : (
            <span>{caption}</span>
          )}
        </button>

        {errorMessage ? (
          <div className="panel">
            <div>
              <ImWarning />
              <span> Substack Not Found</span>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
