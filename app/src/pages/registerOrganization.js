import React, { useRef, useState } from 'react';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { getLatLng } from 'react-google-places-autocomplete/dist/utils/googleGeocodesHelper';

// If you want to use the provided css
import 'react-google-places-autocomplete/dist/assets/index.css';

import { Loading } from 'components/random';

function GetHelp() {
  return (
    <div className="page-container">
      <div className="container">
        <div
          style={{
            maxWidth: '52em',
            margin: '0 auto'
          }}
        >
          <h1>Community Organizations</h1>
          <p>Apply to be a community organization.</p>

          <h2>Preferred Organizations:</h2>
          <ul>
            <li>Government Agencies</li>
            <li>Public Schools</li>
            <li>Churches</li>
            <li>Libraries</li>
          </ul>
        </div>

        <CommunityForm />
      </div>
    </div>
  );
}

export default GetHelp;

function CommunityForm(props) {
  // form
  const [formStatus, setFormStatus] = useState('new');
  const [error, setError] = useState('');

  const locationRef = useRef(null);
  const emailRef = useRef(null);

  const [placeId, setPlaceId] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({});
  async function onSelect(data) {
    console.log(data);

    //
    setPlaceId(data.place_id);
    setAddress(data.description);
    geocodeByPlaceId(data.place_id)
      .then(results => getLatLng(results[0]))
      .then(async latLng => setLatLng(latLng))
      .catch(error => {
        console.log(error);
        setError(error);
      });
  }

  function highlightLocation() {
    locationRef.current.setAttribute('class', 'flashit');
    setTimeout(() => {
      locationRef.current.setAttribute('class', '');
    }, 1000);
  }

  function highlightEmail() {
    emailRef.current.setAttribute('class', 'flashit');
    setTimeout(() => {
      emailRef.current.setAttribute('class', '');
    }, 1000);
  }

  async function submit(event) {
    event.preventDefault();

    // force location
    if (!placeId || !latLng.lng) {
      console.log('no location');
      return highlightLocation();
    }
    // get form data
    const formObject = {
      placeId: placeId,
      address: address,
      location: {
        type: 'Point',
        coordinates: [latLng.lng, latLng.lat]
      }
    };
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    if (!/@gmail.com\s*$/.test(formObject.email)) {
      console.log('not gmail');
      return highlightEmail();
    }

    // loading
    setFormStatus('loading');

    submitJob(formObject)
      .then(link => {
        setFormStatus('success');
      })
      .catch(error => {
        console.log(error);
        setError(error.toString());
        setFormStatus('error');
      });
  }

  return (
    <div className="form-wrapper">
      <form name="addJobForm" onSubmit={submit}>
        {/* Description */}
        <fieldset>
          <legend>Register Organization</legend>

          <div className="form-group">
            <label htmlFor="location">Organization Name</label>
            <input
              type="text"
              name="description"
              required={true}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Contact Name</label>
            <input
              type="text"
              name="displayName"
              required={true}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Contact Phone Number</label>
            <input
              type="text"
              name="phone"
              required={true}
              className="form-control"
            />
          </div>

          <div className="form-group" ref={emailRef}>
            <label htmlFor="location">
              Contact Email Address (must be a "@gmail.com" address)
            </label>
            <input
              type="email"
              name="email"
              required={true}
              className="form-control"
            />
          </div>

          <div className="form-group" ref={locationRef}>
            <label htmlFor="location">Organization Location</label>
            <GooglePlacesAutocomplete
              onSelect={onSelect}
              suggestionsStyles={{
                container: {
                  zIndex: 100
                }
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Organization Service Area Radius (meters)
            </label>
            <input
              type="text"
              name="radius"
              required={true}
              className="form-control"
            />
          </div>
        </fieldset>

        <div className="mb-4"></div>

        <hr />

        {/* Submit & Display */}
        <div style={{ textAlign: 'right' }}>
          {formStatus === 'new' ? (
            <button className="btn btn-theme" type="submit">
              Send Offer
            </button>
          ) : null}

          {formStatus === 'loading' ? <Loading /> : null}

          {formStatus === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <h3>Success!</h3>
              <p>We'll send you an email with more instructions.</p>
            </div>
          ) : null}

          {formStatus === 'error' ? (
            <p style={{ textAlign: 'center' }}>{error}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

async function submitJob(queryData) {
  const method = 'POST';
  const endPoint = '/api/add-org';

  return fetch(endPoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queryData)
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    }

    // some type of error has occured...
    console.log(response.status, response.statusText);
    throw new Error(response.statusText);
  });
}