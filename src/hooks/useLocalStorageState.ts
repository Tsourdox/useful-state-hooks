import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Convenience type
type InitialState<S> = S | (() => S);
type ReturnTuple<S> = [S, Dispatch<SetStateAction<S>>];

/**
 * An extended version of the useState hook that also syncs the state with local storage.
 * @param key which property in local storage to store the state in.
 * @param initialState used to initialize the state either with a value or a function.
 * @returns a tuple containing the state and a setState function.
 */
// Overload signatures
export function useLocalStorageState<S>(key: string, initialState: InitialState<S>): ReturnTuple<S>;
export function useLocalStorageState<S = undefined>(key: string): ReturnTuple<S | undefined>;

// Implementation
export function useLocalStorageState<S>(key: string, initialState?: InitialState<S>): ReturnTuple<S | undefined> {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key);
    if (storedState) {
      const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      return JSON.parse(storedState, (_, value) => {
        if (typeof value === "string" && dateFormat.test(value)) {
          return new Date(value);
        }
        return value;
      }) as S;
    }
    if (typeof initialState === "function") {
      return (initialState as () => S)();
    }
    return initialState;
  });

  useEffect(() => {
    if (state === undefined) {
      localStorage.removeItem(key);
    } else {
      const stringState = typeof state === "string" ? state : JSON.stringify(state);
      localStorage.setItem(key, stringState);
    }
  }, [state]);

  return [state, setState];
}
