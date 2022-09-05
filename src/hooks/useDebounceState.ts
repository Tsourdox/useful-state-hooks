import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

// Convenience types
type InitialState<S> = S | (() => S);
type DebounceCallback<S> = (state: S) => void;
type SetStateCallback<S> = (state: S) => S;
type ReturnTuple<S> = [S, Dispatch<SetStateAction<S>>, DebounceActions];
type DebounceActions = { flush: () => void; cancel: () => void };

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
 * The returned debounce object contains two functions, flush and cancel.
 * Calling flush will call onDebounce immediately instead and calling cancel
 * will prevent it from running - useful when your components are unmounting.
 *
 * @param onDebounce is called with the state as an argument, after the delay.
 * @param initialState can be used to set a default state.
 * @param delay in milliseconds, defaults to 1000.
 * @returns a tuple containing the state, a setState function and a debounce object.
 *
 */
// Overload signatures
export function useDebounceState<S>(
  onDebounce: DebounceCallback<S>,
  initialState: InitialState<S>,
  delay?: number
): ReturnTuple<S>;
export function useDebounceState<S = undefined>(
  onDebounce: DebounceCallback<S>,
  delay?: number
): ReturnTuple<S | undefined>;

// Implementation
export function useDebounceState<S>(
  onDebounce: DebounceCallback<S | undefined>,
  initialState?: InitialState<S>,
  delay = 1000
): ReturnTuple<S | undefined> {
  const [state, setState] = useState(initialState);
  const timerId = useRef<NodeJS.Timeout>();
  const nextState = useRef<S | undefined>();

  const setStateWithDebounce = useCallback(
    (setStateAction: SetStateAction<S | undefined>) => {
      if (timerId.current) clearTimeout(timerId.current);

      nextState.current =
        typeof setStateAction === "function"
          ? (setStateAction as SetStateCallback<S | undefined>)(state)
          : setStateAction;

      timerId.current = setTimeout(() => onDebounce(nextState.current), delay);
      setState(setStateAction);
    },
    [state, delay, onDebounce]
  );

  const debounce = useRef({
    cancel: () => clearTimeout(timerId.current),
    flush: () => {
      debounce.current.cancel();
      onDebounce(nextState.current);
    },
  });

  return [state, setStateWithDebounce, debounce.current];
}

export default useDebounceState;
