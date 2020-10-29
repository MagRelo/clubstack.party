import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from 'App';

import { UserProfile } from 'pages/account/userProfile';
import { FormStatusButtons } from 'components/random';

function UpdateProfile() {
  const { callApi, user, updateUser } = useContext(AuthContext);

  // form state
  const [formDirty, setFormDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // form data
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [caption, setCaption] = useState(user.caption || '');

  // Reset/Cancel => set form data to user data, reset all indicators
  function reset(event) {
    event.preventDefault();

    // set form data
    setDisplayName(user.displayName || '');
    setAvatar(user.avatar || '');
    setCaption(user.caption || '');

    // reset indicators
    setLoading(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFormDirty(false);
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    // send to server
    const formObject = { displayName, avatar, caption };
    await callApi('PUT', 'api/user', formObject)
      .then(async (user) => {
        setLoading(false);
        updateUser(user);
        setFormDirty(false);
        setSuccessMessage('Saved!');
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(error.toString());
        console.log(error);
      });
  }

  // Save Fade out
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        // console.log('This will run after 1 second!');
        setSuccessMessage(null);
      }, 2400);
    }
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <form name="updateProfile" onSubmit={submit}>
      <div className="grid grid-2">
        <UserProfile
          displayUser={{ _id: 0, displayName, avatar, caption }}
          disableLink={true}
        />

        <div className="form-group">
          <label htmlFor="displayName" className="">
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            id="displayName"
            className="form-control"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setFormDirty(true);
            }}
          />
        </div>
      </div>
      <div className="grid grid-2">
        <div>
          <label htmlFor="caption" className="">
            Caption
          </label>
          <input
            type="text"
            name="caption"
            id="caption"
            className="form-control"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
              setFormDirty(true);
            }}
          />
        </div>
        <div>
          <label htmlFor="avatar" className="">
            Avatar URL
          </label>
          <input
            type="text"
            name="avatar"
            id="avatar"
            className="form-control"
            value={avatar}
            onChange={(e) => {
              setAvatar(e.target.value);
              setFormDirty(true);
            }}
          />
        </div>

        <div>
          <label htmlFor="email" className="">
            Email Address
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>
        <div>
          <label htmlFor="publicAddress" className="">
            Public Address
          </label>
          <input
            type="text"
            name="publicAddress"
            id="publicAddress"
            className="form-control"
            value={user.publicAddress}
            disabled
          />
        </div>
      </div>
      <hr />

      <FormStatusButtons
        saveFunction={submit}
        resetFunction={reset}
        isDirty={formDirty}
        isLoading={loading}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </form>
  );
}

export default UpdateProfile;
