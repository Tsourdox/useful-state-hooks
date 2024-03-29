import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorageState } from '../hooks';

beforeEach(() => localStorage.clear());

describe('initial state', () => {
  it('should set state to undefined when used without an initial state', () => {
    const { result } = renderHook(() => useLocalStorageState<string>('undefined'));
    const [state] = result.current;
    expect(state).toBeUndefined();
  });
  it('should set state to the same primitive as was passed in as initial state', () => {
    const { result } = renderHook(() => useLocalStorageState('primitive', 'Initial string'));
    const [state] = result.current;
    expect(state).toBe('Initial string');
  });
  it('should set state to the same object as was passed in as initial state', () => {
    const { result } = renderHook(() => useLocalStorageState('object', { a: 'hello' }));
    const [state] = result.current;
    expect(state).toStrictEqual({ a: 'hello' });
  });
  it('should set state to the same array as was passed in as initial state', () => {
    const { result } = renderHook(() => useLocalStorageState('array', [1, 2, 3]));
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
  it('should set state to the correct value when a callback function is passed in as initial state', () => {
    const { result } = renderHook(() => useLocalStorageState('array', () => [1, 2, 3]));
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
});

describe('syncing with local storage', () => {
  it('should not save data to local storage when no argument or undefined is passed in as initial state', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    renderHook(() => useLocalStorageState('no args'));
    renderHook(() => useLocalStorageState('undefined', undefined));
    expect(setSpy).toHaveBeenCalledTimes(0);
    expect(localStorage.getItem('no args')).toBe(null);
    expect(localStorage.getItem('undefined')).toBe(null);
  });
  it('should save data to local storage under the given key when a value is passed in as initial state', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    renderHook(() => useLocalStorageState('message', 'Hello world'));
    expect(setSpy).toHaveBeenCalledWith('message', 'Hello world');
    expect(localStorage.getItem('message')).toBe('Hello world');
  });
  it('should prefer data saved in local storage over initial state', () => {
    const obj1 = renderHook(() => useLocalStorageState('array', [1, 2, 3]));
    const [state1] = obj1.result.current;
    expect(state1).toStrictEqual([1, 2, 3]);
    const obj2 = renderHook(() => useLocalStorageState('array', [4, 5, 6]));
    const [state2] = obj2.result.current;
    expect(state2).toStrictEqual([1, 2, 3]);
  });
  it('should save to new place in local storage when the key changes', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const { rerender } = renderHook(({ key }) => useLocalStorageState(key, [1, 2, 3]), {
      initialProps: { key: 'origin' },
    });
    rerender({ key: 'new_place' });

    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalledWith('origin', JSON.stringify([1, 2, 3]));
    expect(setSpy).toHaveBeenCalledWith('new_place', JSON.stringify([1, 2, 3]));
  });
});

describe('reviving state', () => {
  it('should be able to save and load booleans to and from local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    renderHook(() => useLocalStorageState('boolean', true));
    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledWith('boolean', JSON.stringify(true));

    const getSpy = vi.spyOn(localStorage, 'getItem');
    const { result } = renderHook(() => useLocalStorageState<boolean>('boolean'));
    const [state] = result.current;
    expect(getSpy).toHaveBeenCalledOnce();
    expect(state).toBeTypeOf('boolean');
    expect(state).toBe(true);
  });
  it('should be able to save and load numbers to and from local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    renderHook(() => useLocalStorageState('number', 222));
    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledWith('number', JSON.stringify(222));

    const getSpy = vi.spyOn(localStorage, 'getItem');
    const { result } = renderHook(() => useLocalStorageState<number>('number'));
    const [state] = result.current;
    expect(getSpy).toHaveBeenCalledOnce();
    expect(state).toBeTypeOf('number');
    expect(state).toBe(222);
  });
  it('should be able to save and load strings to and from local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    renderHook(() => useLocalStorageState('message', 'Hello world'));
    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledWith('message', 'Hello world');

    const getSpy = vi.spyOn(localStorage, 'getItem');
    const { result } = renderHook(() => useLocalStorageState<string>('message'));
    const [state] = result.current;
    expect(getSpy).toHaveBeenCalledOnce();
    expect(state).toBeTypeOf('string');
    expect(state).toBe('Hello world');
  });
  it('should be able to save and load date objects to and from local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const date = new Date();
    renderHook(() => useLocalStorageState('date', date));
    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledWith('date', JSON.stringify(date));

    const getSpy = vi.spyOn(localStorage, 'getItem');
    const { result } = renderHook(() => useLocalStorageState<Date>('date'));
    const [state] = result.current;
    expect(getSpy).toHaveBeenCalledOnce();
    expect(state).toBeTypeOf('object');
    expect(state).toEqual(date);
  });
  it('should be able to save and load objects with date properties to and from local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const date = new Date();
    renderHook(() => useLocalStorageState('date', { date }));
    expect(setSpy).toHaveBeenCalledOnce();
    expect(setSpy).toHaveBeenCalledWith('date', JSON.stringify({ date }));

    const getSpy = vi.spyOn(localStorage, 'getItem');
    const { result } = renderHook(() => useLocalStorageState<Date>('date'));
    const [state] = result.current;
    expect(getSpy).toHaveBeenCalledOnce();
    expect(state).toBeTypeOf('object');
    expect(state).toEqual({ date });
  });
});

describe('updating state', () => {
  it('should be able to update the state and have the value be saved to local storage', () => {
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const { result } = renderHook(() => useLocalStorageState('message', 'initial message'));
    const [_, setMessage] = result.current;
    act(() => setMessage('updated message'));

    const [message] = result.current;
    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenLastCalledWith('message', 'updated message');
    expect(message).toBe('updated message');
  });
  it('should remove item from local storage when updating state to undefined', () => {
    const removeSpy = vi.spyOn(localStorage, 'removeItem');
    const { result } = renderHook(() => useLocalStorageState<number | undefined>('number', 222));
    const [_, setMessage] = result.current;
    act(() => setMessage(undefined));

    const [message] = result.current;
    expect(removeSpy).toHaveBeenCalledOnce;
    expect(removeSpy).toHaveBeenCalledWith('number');
    expect(message).toBe(undefined);
  });

  it('should set item in local storage when updating state to null', () => {
    const removeSpy = vi.spyOn(localStorage, 'removeItem');
    const setSpy = vi.spyOn(localStorage, 'setItem');
    const { result } = renderHook(() => useLocalStorageState<number | null>('number', 222));
    const [_, setMessage] = result.current;
    act(() => setMessage(null));

    const [message] = result.current;
    expect(removeSpy).toHaveBeenCalledTimes(0);
    expect(setSpy).toHaveBeenLastCalledWith('number', JSON.stringify(null));
    expect(message).toBe(null);
  });
});

describe('returned tuple', () => {
  it('should always return the same set state function between renders', () => {
    const { result } = renderHook(() => useLocalStorageState('data', [1, 2, 3]));
    const [_, setData1] = result.current;
    act(() => setData1([1, 2, 3]));
    const [__, setData2] = result.current;
    expect(setData1).toEqual(setData2);
  });
});
