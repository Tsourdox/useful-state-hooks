import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebounceState } from '../hooks';

const clock = vi.useFakeTimers({});

afterEach(() => {
  clock.clearAllTimers();
});

describe('initial state', () => {
  it('should set state to undefined when used without an initial state', () => {
    const { result } = renderHook(() => useDebounceState<string>(() => {}));
    const [state] = result.current;
    expect(state).toBeUndefined();
  });
  it('should set state to the same primitive as was passed in as initial state', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, 'Initial string'));
    const [state] = result.current;
    expect(state).toBe('Initial string');
  });
  it('should set state to the same object as was passed in as initial state', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, { a: 'hello' }));
    const [state] = result.current;
    expect(state).toStrictEqual({ a: 'hello' });
  });
  it('should set state to the same array as was passed in as initial state', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, [1, 2, 3]));
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
  it('should set state to the correct value when passing a function as initial state', () => {
    const { result } = renderHook(() =>
      useDebounceState(
        () => {},
        () => [1, 2, 3]
      )
    );
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
});

describe('updating state', () => {
  it('should be able to update the state when passing a value', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, 'A'));
    const [_, setState] = result.current;
    act(() => setState('B'));
    const [state] = result.current;
    expect(state).toBe('B');
  });
  it('should be able to update the state when passing a function', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, 'A'));
    const [_, setState] = result.current;
    act(() => setState((prev) => prev + 'B'));
    const [state] = result.current;
    expect(state).toBe('AB');
  });
  it('should be able to update the state multiple times within the delay period', () => {
    const { result } = renderHook(() => useDebounceState(() => {}, 'A'));
    const [_, setState] = result.current;

    act(() => setState('B'));
    const [stateB] = result.current;
    expect(stateB).toBe('B');

    act(() => setState('C'));
    const [stateC] = result.current;
    expect(stateC).toBe('C');
  });
});

describe('debounce callback', () => {
  it('should call debounce callback with the latest state value', () => {
    const { result } = renderHook(() =>
      useDebounceState((debouncedState) => {
        expect(debouncedState).toBe('B');
      }, 'A')
    );
    const [_, setState] = result.current;
    act(() => setState('B'));
    clock.advanceTimersByTime(1000);
  });
  it('should call debounce callback with the latest state value when passing a function', () => {
    const { result } = renderHook(() =>
      useDebounceState((debouncedState) => {
        expect(debouncedState).toBe('AB');
      }, 'A')
    );
    const [_, setState] = result.current;
    act(() => setState((prev) => prev + 'B'));
    clock.advanceTimersByTime(1000);
  });
  it('should call debounce callback once with the latest value when updating state multiple times', () => {
    const { result } = renderHook(() =>
      useDebounceState((debouncedState) => {
        expect(debouncedState).toBe('D');
      }, 'A')
    );
    const [_, setState] = result.current;
    act(() => setState('B'));
    act(() => setState('C'));
    act(() => setState('D'));
    clock.advanceTimersByTime(1000);
  });
  it('should call debounce callback after delayed time (15 seconds)', () =>
    new Promise<void>((done) => {
      const { result } = renderHook(() => useDebounceState(() => done(), 'A', 15000));
      const [_, setState] = result.current;
      act(() => setState('B'));
      clock.advanceTimersByTime(15000);
    }));
  it('should call debounce callback immediately with the latest state when the flush function is called', () => {
    const mockObject = {
      callback: (state: string) => {
        expect(state).toBe('C');
      },
    };
    const spy = vi.spyOn(mockObject, 'callback');

    const { result } = renderHook(() => useDebounceState<string>(mockObject.callback, 'A'));
    const [_, setState, debounce] = result.current;
    act(() => setState('B'));
    act(() => setState('C'));
    debounce.flush();

    clock.advanceTimersByTime(1000);
    const [state] = result.current;
    expect(state).toBe('C');
    expect(spy).toHaveBeenCalledOnce();
  });
  it('should not call debounce callback when the cancel function is called', () => {
    const mockObject = {
      callback: () => {},
    };
    const spy = vi.spyOn(mockObject, 'callback');

    const { result } = renderHook(() => useDebounceState(mockObject.callback, 'A'));
    const [_, setState, debounce] = result.current;
    act(() => setState('B'));
    act(() => setState('C'));
    debounce.cancel();

    clock.advanceTimersByTime(1000);
    const [state] = result.current;
    expect(state).toBe('C');
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it('should be able to reference and use another state value from the debounce callback', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0);
      useDebounceState<string>(() => {
        expect(count).toBe(10);
      });
      return [count, setCount] as const;
    });
    const [, setCount] = result.current;
    act(() => setCount((prev) => prev + 10));
    const [count] = result.current;
    expect(count).toEqual(10);
    clock.advanceTimersByTime(1000);
  });
});

describe('returned tuple', () => {
  it('should return the same set state function between renders', () => {
    const { result, rerender } = renderHook(() => useDebounceState<string>(() => {}));

    const [, setState1] = result.current;
    rerender();
    const [, setState2] = result.current;
    act(() => setState2('changed'));
    const [, setState3] = result.current;

    expect(setState1).toEqual(setState2);
    expect(setState2).toEqual(setState3);
  });
  it('should return a new set state function when delay prop changes', () => {
    const { result, rerender } = renderHook(
      ({ delay }) => useDebounceState<string>(() => {}, '', delay),
      { initialProps: { delay: 1000 } }
    );

    const [, setState1] = result.current;
    rerender({ delay: 2000 });
    const [, setState2] = result.current;

    expect(setState1).not.toEqual(setState2);
  });
  it('should return the same debounce object between renders', () => {
    const { result, rerender } = renderHook(() => useDebounceState<string>(() => {}));

    const [, , debounce1] = result.current;
    rerender();
    const [, setState, debounce2] = result.current;
    act(() => setState('changed'));
    const [, , debounce3] = result.current;

    expect(debounce1).toEqual(debounce2);
    expect(debounce2).toEqual(debounce3);
  });
});
