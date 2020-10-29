import React, { useState, useEffect, useContext } from 'react';
import { Link } from '@reach/router';

import { BiChevronRight } from 'react-icons/bi';

import { AuthContext } from 'App';
import { Loading, useDebounce, Bouncing } from 'components/random';
import { FormStatusButtons } from 'components/random';

export default function AdminPage({ subdomain }) {
  const { callApi, user } = useContext(AuthContext);

  const editingContent = !!subdomain;
  // console.log('editing', editingContent);

  const [loading, setLoading] = useState(editingContent);
  const [error, setError] = useState(false);
  const [setContent] = useState(null);

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
  }, [callApi, user, editingContent, setContent]);

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
        <h2>{editingContent ? 'Update' : 'Activate'} Settings</h2>
        <p>
          <Link to="/website">Website</Link> <BiChevronRight />{' '}
          <u>{editingContent ? 'Update' : 'Activate'} Settings</u>
        </p>

        <UpdateSubdomain incomingSubdomain={user.subdomain} />

        <UpdateSubdomainData subdomainData={user.subdomainData} />
      </div>
    </div>
  );
}

export function UpdateSubdomain() {
  const { callApi, user, updateUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formDirty, setFormDirty] = useState(false);
  const [available, setAvailable] = useState(false);

  // set editing vs adding
  // const [isEditing, setIsEditing] = useState(!user.subdomain);
  const [status, setStatus] = useState(
    !!user.subdomain ? 'Active' : 'Type to search...'
  );

  const [subdomain, setSubdomain] = useState(user.subdomain || null);
  const debouncedSearchTerm = useDebounce(subdomain, 500);
  const [searching, setIsSearching] = useState(false);

  // searching available subdomains
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm !== user.subdomain) {
      setIsSearching(true);
      setFormDirty(true);
      checkAvailable(debouncedSearchTerm).then((isAvailable) => {
        setIsSearching(false);
        setAvailable(isAvailable);
        setStatus(isAvailable ? 'Available' : 'Not Available');
      });
    } else {
      setAvailable(false);
      // setStatus('Type to search...');
    }
  }, [debouncedSearchTerm, user]);

  async function checkAvailable(subdomain) {
    // fetch api
    return fetch('/api/group/' + subdomain)
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

  function cancel() {
    setFormDirty(false);
    setSubdomain(user.subdomain);
    setStatus('Active');
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    // send to server
    let method = 'PUT';
    let endpoint = '/api/user/subdomain';

    await callApi(method, endpoint, { subdomain })
      .then(async (user) => {
        setLoading(false);
        setSuccessMessage('Saved!');
        setStatus('Active');
        updateUser(user);
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
    <div>
      <h3 className="background">
        <span>Website Address</span>
      </h3>

      <div className="panel form-wrapper">
        <form name="editSubdomain" onSubmit={submit}>
          <div>
            <div className="form-group">
              <label htmlFor="subdomain" className="">
                Website Address
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
                  onChange={(e) => {
                    setSubdomain(e.target.value);
                  }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">.clubstack.party</div>
                </div>
              </div>
            </div>

            <div className="grid-left">
              <div className="grid-label">Status</div>
              <div>{searching ? <Bouncing /> : <span>{status}</span>}</div>
            </div>
          </div>

          {/* <hr />
          <code>{JSON.stringify({ subdomain, searching, available })}</code> */}

          <hr />

          <FormStatusButtons
            saveFunction={submit}
            resetFunction={cancel}
            isDirty={formDirty && available}
            isLoading={loading}
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
        </form>
      </div>
    </div>
  );
}

export function UpdateSubdomainData() {
  const { callApi, user, updateUser } = useContext(AuthContext);

  // form state
  const [formDirty, setFormDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [
    { title, description, copyright, owner, image, alt },
    setState,
  ] = useState(
    user.subdomainData || {
      title: '',
      description: '',
      copyright: '',
      owner: '',
      image: '',
      alt: '',
    }
  );

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormDirty(true);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    // send to server
    let method = 'PUT';
    let endpoint = '/api/user/subdomain';
    await callApi(method, endpoint, {
      subdomainData: { title, description, copyright, owner, image, alt },
    })
      .then(async (user) => {
        // reset indicators
        setLoading(false);
        setErrorMessage(null);
        setSuccessMessage('Saved!');
        setFormDirty(false);

        updateUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Reset/Cancel => set form data to user data, reset all indicators
  function reset(event) {
    event.preventDefault();

    // set form data
    setState({ ...user.subdomainData });

    // reset indicators
    setLoading(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFormDirty(false);
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
    <div>
      <h3 className="background">
        <span>Website Information</span>
      </h3>
      <div className="panel">
        <form name="editSubdomainData" onSubmit={submit}>
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
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
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
                  onChange={onChange}
                />
              </div>
            ) : null}
          </div>
          {/* 
          <hr />
          <code>{JSON.stringify({ title, description })}</code> */}

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
      </div>
    </div>
  );
}
