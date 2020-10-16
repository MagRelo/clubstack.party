import React, { useState, useEffect, useContext } from 'react';
import { Link, navigate } from '@reach/router';

import { BiChevronRight } from 'react-icons/bi';

import { AuthContext } from 'App';
import { Bouncing, useDebounce } from 'components/random';

export default function AdminPage({ subdomain }) {
  const { callApi } = useContext(AuthContext);

  const editingContent = !!subdomain;

  const [site, setSubdomain] = useState(subdomain);
  const [subdomainData, setSubdomainData] = useState(null);
  const [ownerEmail, setOwnerEmail] = useState(undefined);

  const [loading, setLoading] = useState(editingContent);
  const [error, setError] = useState(false);

  useEffect(() => {
    const method = 'GET';
    const endPoint = '/api/admin/subdomain/' + site;

    if (editingContent) {
      setLoading(true);
      callApi(method, endPoint)
        .then((body) => {
          setSubdomain(body.subdomain);
          setSubdomainData(body.subdomainData);
          setOwnerEmail(body.email);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setError(error.toString());
          setLoading(false);
        });
    }
  }, [callApi, site, editingContent]);

  return (
    <div className="container">
      {error ? <p>{error}</p> : null}
      {loading ? (
        <Bouncing />
      ) : (
        <div>
          <h2>{editingContent ? 'Update' : 'Activate'} Subdomain</h2>
          <p>
            <Link to="/admin">Admin</Link> <BiChevronRight />{' '}
            <Link to="/admin/subdomain">Subdomain</Link> <BiChevronRight />{' '}
            <u>{editingContent ? 'Update' : 'Activate'}</u>
          </p>
          {/* <UpdateSubdomain /> */}

          <UpdateSubdomainData
            ownerEmail={ownerEmail}
            incomingSubdomain={site}
            subdomainData={subdomainData}
          />
        </div>
      )}
    </div>
  );
}

export function UpdateSubdomainData({
  ownerEmail,
  incomingSubdomain,
  subdomainData,
}) {
  const { callApi } = useContext(AuthContext);

  const [email, setEmail] = useState(ownerEmail || undefined);

  const [productCode, setProductCode] = useState(
    subdomainData?.productCode || undefined
  );

  const [title, setTitle] = useState(subdomainData?.title || undefined);
  const [description, setDescription] = useState(
    subdomainData?.description || undefined
  );
  const [image, setImage] = useState(subdomainData?.image || undefined);
  const [alt, setAlt] = useState(subdomainData?.alt || undefined);
  const [copyright, setCopyright] = useState(
    subdomainData?.copyright || undefined
  );

  const [pullSubstack, setPullSubstack] = useState(
    subdomainData?.pullSubstack || true
  );
  const [status, setStatus] = useState(
    !!incomingSubdomain ? 'Active' : 'Type to search...'
  );

  const [subdomain, setSubdomain] = useState(incomingSubdomain || '');
  const debouncedSearchTerm = useDebounce(subdomain, 500);
  const [searching, setIsSearching] = useState(false);
  const [available, setAvailable] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // searching available subdomains
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm !== incomingSubdomain) {
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
  }, [debouncedSearchTerm, incomingSubdomain]);

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

  async function submit(event) {
    event.preventDefault();

    // get form data
    const formObject = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      setLoading(true);

      // send to server
      let method = 'PUT';
      let endpoint = '/api/admin/subdomain';
      await callApi(method, endpoint, formObject)
        .then(async (user) => {
          navigate('/admin/subdomain');
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <div className="panel">
        <form name="updateContent" onSubmit={submit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="email" className="">
                Owner Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
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
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">.clubstack.party</div>
                </div>

                <div className="input-group-append">
                  <div className="input-group-text">{status}</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productCode" className="">
                Product Code
              </label>
              <input
                type="text"
                name="productCode"
                id="productCode"
                className="form-control"
                value={productCode}
                onChange={(e) => {
                  setProductCode(e.target.value);
                }}
                required
              />
            </div>
          </div>

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

            <div className="form-group">
              <label htmlFor="email" className="">
                Substack
              </label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="pullSubstack"
                  checked={pullSubstack}
                  onChange={(e) => {
                    setPullSubstack(e.target.value);
                  }}
                />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  Pull Substack?
                </label>
              </div>
            </div>
          </div>
          {/* 
          <hr />
          <code>{JSON.stringify({ isEditing })}</code> */}

          <hr />

          <button className="btn btn-theme">
            {loading ? (
              <span>
                <Bouncing />
              </span>
            ) : (
              <span>Save</span>
            )}
          </button>

          {errorMessage ? (
            <div>
              <div className="mb-4"></div>
              <code>{errorMessage}</code>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
