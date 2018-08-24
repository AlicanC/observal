// @flow

import Observable, { type Observer } from 'zen-observable';

export type Updates<Value> = Observable<Value>;

export type Observalue<Value> = $ReadOnly<{
  get: () => Value,
  set: (value: Value) => mixed,
  updates: Updates<Value>,
}>;

export default function createObservalue<Value>(initialValue: Value): $Exact<Observalue<Value>> {
  // State observation
  const observers: Set<Observer<Value>> = new Set();

  const updates = new Observable((observer) => {
    observers.add(observer);
    return () => {
      observers.delete(observer);
    };
  });

  const send = (value: Value) => observers.forEach((o) => o.next(value));

  // State management
  let value = initialValue;

  const get = () => value;

  const set = (nextValue: Value) => {
    value = nextValue;
    send(value);
  };

  // Store
  const observalue = {
    get,
    set,
    updates,
  };

  Object.freeze(observalue);

  return observalue;
}
