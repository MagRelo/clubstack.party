import React, { useContext, useState } from 'react';
import { AuthContext } from 'App';

import { UserProfile } from 'pages/account/userProfile';

function UpdateProfile(props) {
  const { callApi, user, createSession } = useContext(AuthContext);

  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [caption, setCaption] = useState(user.caption || '');

  async function submit(event) {
    event.preventDefault();

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    console.log(formObject);

    // send to server
    await callApi('PUT', 'api/user', formObject)
      .then(async (user) => {
        createSession(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="">
        <form name="updateProfile" onSubmit={submit}>
          <div className="mb-4"></div>

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
                onChange={(e) => setDisplayName(e.target.value)}
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
                onChange={(e) => setCaption(e.target.value)}
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
                onChange={(e) => setAvatar(e.target.value)}
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
          <button className="btn btn-theme">Save</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
