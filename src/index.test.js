// @flow

import createObservalue from '.';

test('can be created without initialValue', () => {
  const observalue = createObservalue();

  expect(observalue.get()).toBe(undefined);
});

test('can be created with initialValue', () => {
  const initialValue = Symbol();
  const observalue = createObservalue(initialValue);

  expect(observalue.get()).toBe(initialValue);
});

test('can be mutated', () => {
  const initialValue = Symbol();
  const observalue = createObservalue(initialValue);

  expect(observalue.get()).toBe(initialValue);

  const nextValue = Symbol();
  observalue.set(nextValue);

  expect(observalue.get()).toBe(nextValue);
});

test('sends update after mutation', () => {
  const observalue = createObservalue(0);

  const subscriber = jest.fn();

  observalue.updates.subscribe(subscriber);

  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenLastCalledWith(observalue.get());

  observalue.set(observalue.get() + 1);
  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenCalledTimes(3);
});

test('creates frozen store', () => {
  const store = createObservalue();

  expect(() => {
    // $FlowExpectError
    store.a = true;
  }).toThrow();
});

test('sends update after set()', () => {
  const observalue = createObservalue(0);

  const subscriber = jest.fn();

  observalue.updates.subscribe(subscriber);

  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenLastCalledWith(observalue.get());

  observalue.set(observalue.get() + 1);
  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenCalledTimes(3);
});

test('stops sending updates after unsubscription', () => {
  const observalue = createObservalue(0);

  const subscriber = jest.fn();

  const subscription = observalue.updates.subscribe(subscriber);

  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenCalledTimes(1);

  subscription.unsubscribe();

  observalue.set(observalue.get() + 1);

  expect(subscriber).toHaveBeenCalledTimes(1);
});
