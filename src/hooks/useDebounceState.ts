import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

// Convenience types
type InitialState<S> = S | (() => S);
type Callback<S> = (state: S) => void;
type ReturnTuple<S> = [S, Dispatch<SetStateAction<S>>];

/**
 * Useful when you want to update a state often but not trigger related actions
 * at same rate. Multiple state updates in a row within the delay window will only
 * result in the callback being fired once. The callback will be invoked, with the
 * latest state value, when no state updates has happened for the given delay.
 *
 * Example:
 * A user types into a field which updates the state as normal but other
 * actions like calling an API or calculating expensive things might be
 * better to do when the user stops typing for a short period.
 *
 * @param onDebounce is called with the state as an argument, after the delay.
 * @param initialState can be used to set a default state.
 * @param delay in milliseconds, defaults to 1000.
 * @returns a tuple containing the state and a setState function.
 */
// Overload signatures
export function useDebounceState<S>(
  onDebounce: Callback<S>,
  initialState: InitialState<S>,
  delay?: number
): ReturnTuple<S>;
export function useDebounceState<S = undefined>(
  onDebounce: Callback<S>,
  delay?: number
): ReturnTuple<S | undefined>;

// Implemetation
export function useDebounceState<S>(
  onDebounce: Callback<S | undefined>,
  initialState?: InitialState<S>,
  delay = 1000
): ReturnTuple<S | undefined> {
  const [state, setState] = useState(initialState);
  const timerId = useRef<NodeJS.Timeout>();

  const setStateWithDebounce = useCallback(
    (setStateAction: SetStateAction<S | undefined>) => {
      const getNextState = () => {
        return typeof setStateAction === "function"
          ? (setStateAction as (prevState: S | undefined) => S)(state)
          : setStateAction;
      };

      if (timerId.current) clearTimeout(timerId.current);
      timerId.current = setTimeout(() => onDebounce(getNextState()), delay);
      setState(setStateAction);
    },
    [state, delay]
  );

  return [state, setStateWithDebounce];
}

export default useDebounceState;
