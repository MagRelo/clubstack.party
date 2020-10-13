import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { BiChevronRight } from 'react-icons/bi';

import { AuthContext } from 'App';
import { Loading, useDebounce } from 'components/random';

export default function AdminPage({ subdomain }) {
  const { callApi, user } = useContext(AuthContext);

  const editingContent = !!subdomain;
  // console.log('editing', editingContent);

  const [loading, setLoading] = useState(editingContent);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const method = 'GET';
    const endPoint = '/api/user/' + user._id;

    if (editingContent) {
      setLoading(true);
      callApi(method, endPoint)
        .then((body) => {
          setContent(body);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.toString());
          setLoading(false);
        });
    }
  }, [callApi, user, editingContent]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2>{editingContent ? 'Update' : 'Activate'} Subdomain</h2>
          <p>
            <Link to="/admin">Admin</Link> <BiChevronRight />{' '}
            <Link to="/admin/subdomain">Subdomain</Link> <BiChevronRight />{' '}
            <u>{editingContent ? 'Update' : 'Activate'}</u>
          </p>
          <UpdateSubdomain incomingSubdomain={user.subdomain} />

          <UpdateSubdomainData subdomainData={user.subdomainData} />
        </div>
      )}
    </div>
  );
}

export function AccountPage() {
  const { user } = useContext(AuthContext);

  const editingContent = !!user.subdomain;

  return (
    <div className="container">
      <div>
        <h2>{editingContent ? 'Update' : 'Activate'} Subdomain</h2>
        <p>
          <Link to="/account">Account</Link> <BiChevronRight />{' '}
          <u>{editingContent ? 'Update' : 'Activate'} Subdomain</u>
        </p>
        <UpdateSubdomain incomingSubdomain={user.subdomain} />

        <UpdateSubdomainData subdomainData={user.subdomainData} />
      </div>
    </div>
  );
}

export function UpdateSubdomain() {
  const { callApi, user, updateUser } = useContext(AuthContext);

  // set editing vs adding
  const [isEditing, setIsEditing] = useState(!user.subdomain);
  const [available, setAvailable] = useState(false);

  const [status, setStatus] = useState(
    !!user.subdomain ? 'Active' : 'Type to search...'
  );

  const [subdomain, setSubdomain] = useState(user.subdomain || null);
  const debouncedSearchTerm = useDebounce(subdomain, 500);
  const [searching, setIsSearching] = useState(false);

  // searching available subdomains
  useEffect(() => {
    if (
      debouncedSearchTerm &&
      debouncedSearchTerm !== user.subdomain &&
      isEditing
    ) {
      setIsSearching(true);
      checkAvailable(debouncedSearchTerm).then((isAvailable) => {
        setIsSearching(false);
        setAvailable(isAvailable);
        setStatus(isAvailable ? 'Available' : 'Not Available');
      });
    } else {
      setAvailable(false);
      // setStatus('Type to search...');
    }
  }, [debouncedSearchTerm, user, isEditing]);

  async function checkAvailable(subdomain) {
    // fetch api
    return fetch('/api/user/subdomain/' + subdomain)
      .then((response) => {
        if (response.status === 204) {
          return true;
        } else return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  function editing() {
    setStatus('Type to search...');
    setIsEditing(true);
  }

  function cancel() {
    setIsEditing(false);
    setSubdomain(user.subdomain);
    setStatus('Active');
  }

  async function submit(event) {
    event.preventDefault();

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // send to server
    let method = 'PUT';
    let endpoint = '/api/user/subdomain';

    await callApi(method, endpoint, formObject)
      .then(async (user) => {
        updateUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="panel">
        <form name="updateContent" onSubmit={submit}>
          <div className="grid grid-3">
            <div className="form-group">
              <label htmlFor="subdomain" className="">
                Website URL
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <div className="input-group-text">https://</div>
                </div>
                <input
                  type="text"
                  name="subdomain"
                  id="subdomain"
                  className="form-control"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  disabled={!isEditing}
                />
                <div className="input-group-append">
                  <div className="input-group-text">.clubstack.party</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="">
                Status
              </label>
              <div className="input-group">
                <input
                  type="text"
                  name="status"
                  id="status"
                  className="form-control"
                  value={status}
                  disabled
                />
              </div>
            </div>

            <div className="form-group" style={{ paddingTop: '28px' }}>
              <div>
                {isEditing ? (
                  <React.Fragment>
                    <button className="btn btn-theme" disabled={!available}>
                      Save
                    </button>
                    <button
                      className="btn "
                      onClick={() => {
                        cancel();
                      }}
                    >
                      Cancel
                    </button>
                  </React.Fragment>
                ) : (
                  <button className="btn btn-theme" onClick={() => editing()}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* 
          <hr />
          <code>{JSON.stringify({ subdomain, isEditing, available })}</code> */}
        </form>
      </div>
    </div>
  );
}

export function UpdateSubdomainData({ incomingSubdomain, subdomainData }) {
  const { callApi, user, updateUser } = useContext(AuthContext);

  // set editing vs adding
  const [isEditing, setIsEditing] = useState(!!user.subdomain);

  const [title, setTitle] = useState(user.subdomainData?.title || '');
  const [description, setDescription] = useState(
    user.subdomainData?.description || ''
  );
  const [image, setImage] = useState(user.subdomainData?.image || '');
  const [alt, setAlt] = useState(user.subdomainData?.alt || '');
  const [copyright, setCopyright] = useState(
    user.subdomainData?.copyright || ''
  );
  const [owner, setOwner] = useState(user.subdomainData?.owner || '');

  async function submit(event) {
    event.preventDefault();

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // send to server
    let method = 'PUT';
    let endpoint = '/api/user/subdomain';
    await callApi(method, endpoint, { subdomainData: formObject })
      .then(async (user) => {
        updateUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="panel">
        <form name="updateContent" onSubmit={submit}>
          <div className="grid grid-3">
            <div className="form-group">
              <label htmlFor="title" className="">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="">
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="copyright" className="">
                Copyright
              </label>
              <input
                type="text"
                name="copyright"
                id="copyright"
                className="form-control"
                value={copyright}
                onChange={(e) => {
                  setCopyright(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="image" className="">
                Image
              </label>
              <input
                type="text"
                name="image"
                id="image"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="">
                Image Alt Text
              </label>
              <input
                type="text"
                name="alt"
                id="alt"
                className="form-control"
                value={alt}
                onChange={(e) => {
                  setAlt(e.target.value);
                }}
              />
            </div>

            {user.type === 'Admin' ? (
              <div className="form-group">
                <label htmlFor="owner" className="">
                  Owner Email
                </label>
                <input
                  type="text"
                  name="owner"
                  id="owner"
                  className="form-control"
                  value={owner}
                  onChange={(e) => {
                    setOwner(e.target.value);
                  }}
                />
              </div>
            ) : null}
          </div>
          {/* 
          <hr />
          <code>{JSON.stringify({ isEditing })}</code> */}

          <hr />
          <button className="btn btn-theme">Save</button>
        </form>
      </div>
    </div>
  );
}
