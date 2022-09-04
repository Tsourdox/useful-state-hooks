import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebounceState } from "../hooks";

const clock = vi.useFakeTimers({});

afterEach(() => {
  clock.clearAllTimers();
});

describe("initial state", () => {
  it("should set state to undefined when used without an initial state", () => {
    const { result } = renderHook(() => useDebounceState<string>(() => {}));
    const [state] = result.current;
    expect(state).toBe("Initial string");
  });
  it("should set state to the same primitive as was passed in as initial state", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, "Initial string"));
    const [state] = result.current;
    expect(state).toBe("Initial string");
  });
  it("should set state to the same object as was passed in as initial state", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, { a: "hello" }));
    const [state] = result.current;
    expect(state).toStrictEqual({ a: "hello" });
  });
  it("should set state to the same array as was passed in as initial state", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, [1, 2, 3]));
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
  it("should set state to the correct value when passing a function as initial state", () => {
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

describe("updating state", () => {
  it("should be able to update the state when passing a value", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, "A"));
    const [_, setState] = result.current;
    act(() => setState("B"));
    const [state] = result.current;
    expect(state).toBe("B");
  });
  it("should be able to update the state when passing a function", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, "A"));
    const [_, setState] = result.current;
    act(() => setState((prev) => prev + "B"));
    const [state] = result.current;
    expect(state).toBe("AB");
  });
  it("should be able to update the state multiple times within the delay period", () => {
    const { result } = renderHook(() => useDebounceState(() => {}, "A"));
    const [_, setState] = result.current;

    act(() => setState("B"));
    const [stateB] = result.current;
    expect(stateB).toBe("B");

    act(() => setState("C"));
    const [stateC] = result.current;
    expect(stateC).toBe("C");
  });
});

describe("callback runs", () => {
  it("should call debounce callback with the latest state value", () =>
    new Promise<void>((done) => {
      const { result } = renderHook(() =>
        useDebounceState((debouncedState) => {
          expect(debouncedState).toBe("Test");
          done();
        }, "A")
      );
      const [_, setState] = result.current;
      act(() => setState("Test"));
      clock.advanceTimersByTime(1000);
    }));
  it("should call debounce callback with the latest state value when passing a function", () =>
    new Promise<void>((done) => {
      const { result } = renderHook(() =>
        useDebounceState((debouncedState) => {
          expect(debouncedState).toBe("AB");
          done();
        }, "A")
      );
      const [_, setState] = result.current;
      act(() => setState((prev) => prev + "B"));
      clock.advanceTimersByTime(1000);
    }));
  it("should call debounce callback once with the lastest value when updating state multiple times", () =>
    new Promise<void>((done) => {
      const { result } = renderHook(() =>
        useDebounceState((debouncedState) => {
          expect(debouncedState).toBe("D");
          done();
        }, "A")
      );
      const [_, setState] = result.current;
      act(() => setState("B"));
      act(() => setState("C"));
      act(() => setState("D"));
      clock.advanceTimersByTime(1000);
    }));
  it("should call debounce callback after delayed time (15 seconds)", () =>
    new Promise<void>((done) => {
      const { result } = renderHook(() => useDebounceState(() => done(), "A", 15000));
      const [_, setState] = result.current;
      act(() => setState("B"));
      clock.advanceTimersByTime(15000);
    }));
});
