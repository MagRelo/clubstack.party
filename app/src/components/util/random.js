import React, { useState, useEffect } from 'react';
import { Tab } from '@reach/tabs';

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

export function formatCurrency(input, isShorthand) {
  // type checks
  let inputNum = null;
  if (typeof input === 'string') {
    inputNum = parseInt(input, 10);
  } else {
    inputNum = input;
  }

  // output style
  if (isShorthand) {
    return abbreviateNumber(inputNum);
  } else {
    return inputNum.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
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
    [value]
  );

  return debouncedValue;
}

export function CoolTab(props) {
  // `isSelected` comes from `TabList` cloning the `CoolTab`.
  const { isSelected, children } = props;

  // make sure to forward *all* props received from TabList
  return (
    <Tab
      {...props}
      style={{
        background: 'none',
        border: 'none',
        color: 'gray',
        borderBottom: isSelected ? 'solid 1px #cbcbcb' : 'none',
        marginRight: '1em'
      }}
    >
      {children}
    </Tab>
  );
}

export function lineItem(label, value) {
  return (
    <p className="line-item" style={{ padding: '0 1em' }}>
      <span>{label}</span>
      <span className="line-item-filler" />
      <span>{value}</span>
    </p>
  );
}

export async function callAPI(method, endpoint, data) {
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (response.status === 200) {
    return response.json();
  }

  if (response.status === 401) {
    // redirect
  }

  throw new Error(response.message);
}

export function usePromise(promiseOrFunction, defaultValue) {
  const [state, setState] = React.useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  React.useEffect(
    () => {
      const promise =
        typeof promiseOrFunction === 'function'
          ? promiseOrFunction()
          : promiseOrFunction;

      let isSubscribed = true;
      promise
        .then(value =>
          isSubscribed
            ? setState({ value, error: null, isPending: false })
            : null
        )
        .catch(error =>
          isSubscribed
            ? setState({ value: defaultValue, error: error, isPending: false })
            : null
        );

      return () => (isSubscribed = false);
    },
    [promiseOrFunction, defaultValue]
  );

  const { value, error, isPending } = state;
  return [value, error, isPending];
}

export function Loading() {
  return (
    <div className="spinner" style={{ margin: '0 auto' }}>
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
}
