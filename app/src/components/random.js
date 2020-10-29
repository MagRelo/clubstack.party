import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';

import { AuthContext } from 'App';

// resources
import { BsFillChatDotsFill } from 'react-icons/bs';
import { GoFileSubmodule } from 'react-icons/go';
import { MdEmail } from 'react-icons/md';
import { IoIosGlobe } from 'react-icons/io';
import { ImNewspaper } from 'react-icons/im';
import { MdOndemandVideo } from 'react-icons/md';

var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

function abbreviateNumber(number) {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(number) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled + suffix;
}

export function formatNumber(input) {
  if (typeof input == 'undefined') {
    return '';
  }

  // type checks
  let inputNum = 0;
  if (typeof input === 'string') {
    inputNum = parseInt(input, 10);
  } else {
    inputNum = input;
  }

  return Math.round(inputNum);
}

export function formatCurrency(input, isShorthand) {
  if (typeof input == 'undefined') {
    return '';
  }
  // type checks
  let inputNum = 0;
  if (typeof input === 'string') {
    inputNum = parseInt(input, 10);
  } else {
    inputNum = input;
  }

  // output style
  if (isShorthand) {
    return '$' + abbreviateNumber(inputNum);
  } else {
    return inputNum.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
}

export function formatDate(input) {
  if (input instanceof Date) {
    return input.toLocaleDateString('en-US');
  } else {
    const date = new Date(input);
    return date.toLocaleDateString('en-US');
  }
}

// Our hook
export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay]
  );

  return debouncedValue;
}

export function usePromise(promiseOrFunction, defaultValue) {
  const [state, setState] = React.useState({
    value: defaultValue,
    error: null,
    isPending: true,
  });

  React.useEffect(() => {
    const promise =
      typeof promiseOrFunction === 'function'
        ? promiseOrFunction()
        : promiseOrFunction;

    let isSubscribed = true;
    promise
      .then((value) =>
        isSubscribed ? setState({ value, error: null, isPending: false }) : null
      )
      .catch((error) =>
        isSubscribed
          ? setState({ value: defaultValue, error: error, isPending: false })
          : null
      );

    return () => (isSubscribed = false);
  }, [promiseOrFunction, defaultValue]);

  const { value, error, isPending } = state;
  return [value, error, isPending];
}

export function Loading() {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '1em',
      }}
    >
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export function Bouncing() {
  return (
    <div style={{ textAlign: 'center', display: 'inline-block' }}>
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed'; //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function() {
      console.log('Async: Copying to clipboard was successful!');
    },
    function(err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}

export function getParams(location) {
  if (!location.search) {
    return '';
  }

  return getJsonFromUrl(location.search);
}

function getJsonFromUrl(search) {
  var query = search.substr(1);
  var result = {};
  query.split('&').forEach(function(part) {
    var item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: isCurrent ? 'nav-link active' : 'nav-link',
      };
    }}
  />
);

export function SubscriptionLink() {
  const [stripeLink, setStripeLink] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { callApi, user } = React.useContext(AuthContext);

  const hasSubscriptions = !!user?.subscriptions.length || false;

  useEffect(() => {
    if (hasSubscriptions) {
      setLoading(true);
      callApi('POST', '/api/user/subscription', {})
        .then((response) => {
          setStripeLink(response.url);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [callApi, hasSubscriptions]);

  return (
    <a
      href={stripeLink}
      disabled={loading && !hasSubscriptions}
      className="btn btn-theme"
    >
      {loading ? <Bouncing /> : <span>Manage Subscriptions</span>}
    </a>
  );
}

export function ToolGrid() {
  return (
    <div className="grid tool-grid">
      <div className="tool-grid-item">
        <div className="icon-large">
          <BsFillChatDotsFill />
        </div>
        Live Chat
      </div>

      <div className="tool-grid-item">
        <div className="icon-large">
          <MdOndemandVideo />
        </div>
        Video Conferencing
      </div>

      <div className="tool-grid-item">
        <div className="icon-large">
          <GoFileSubmodule />
        </div>
        File Sharing
      </div>
    </div>
  );
}

export function SiteGrid() {
  return (
    <div className="grid tool-grid">
      <div className="tool-grid-item">
        <div className="icon-large">
          <IoIosGlobe />
        </div>
        Website
      </div>

      <div className="tool-grid-item">
        <div className="icon-large">
          <ImNewspaper />
        </div>
        Blog
      </div>

      <div className="tool-grid-item">
        <div className="icon-large">
          <MdEmail />
        </div>
        Weekly Newsletter
      </div>
    </div>
  );
}

export function FormStatusButtons({
  saveFunction,
  resetFunction,
  isDirty,
  isLoading,
  errorMessage,
  successMessage,
}) {
  return (
    <React.Fragment>
      {/* Save */}
      <button
        className="btn btn-theme"
        disabled={!isDirty || isLoading || errorMessage}
        onClick={saveFunction}
      >
        <span>Save</span>
      </button>

      {/* Cancel */}
      <button
        className="btn btn-sm"
        onClick={resetFunction}
        disabled={!isDirty || isLoading || errorMessage}
      >
        <span>Cancel</span>
      </button>

      {/* loading */}
      {isLoading ? <Bouncing /> : null}

      <span style={{ marginLeft: '1rem' }}>
        {/* Success */}
        {successMessage ? <span>{successMessage}</span> : null}

        {/* Error */}
        {errorMessage ? (
          <span>
            <code>{errorMessage}</code>
            <button
              className="btn btn-sm"
              style={{ marginLeft: '1rem' }}
              onClick={resetFunction}
            >
              <span>Reset</span>
            </button>
          </span>
        ) : null}
      </span>
      {/* 
      <hr />
      {JSON.stringify({
        saveFunction,
        resetFunction,
        isDirty,
        isLoading,
        errorMessage,
        successMessage,
      })} */}
    </React.Fragment>
  );
}

// function withLogger(dispatch) {
//   return function(action) {
//     console.groupCollapsed('Action Type:', action.type);
//     return dispatch(action);
//   };
// }

// function useReducerWithLogger(...args) {
//   let prevState = useRef(initialState);
//   const [state, dispatch] = useReducer(...args);

//   const dispatchWithLogger = useMemo(() => {
//     return withLogger(dispatch);
//   }, [dispatch]);

//   useEffect(() => {
//     if (state !== initialState) {
//       console.log('Prev state: ', prevState.current);
//       console.log('Next state: ', state);
//       console.groupEnd();
//     }
//     prevState.current = state;
//   }, [state]);

//   return [state, dispatchWithLogger];
// }
