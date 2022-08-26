import { useCallback, useRef, useState } from "react";

/**
 * Custom hook that handle list states and exposes set functions which won't mutate the array.
 * @param defaultState intial list of values
 * @param compareProperty used to compare if objects are the
 * @returns
 */
export function useListState<S>(
  defaultState: S[],
  ...compareProperty: S extends object ? [v: keyof S] : [v?: never]
): S extends object
  ? [S[], { add: (item: S) => void; update: (item: S) => void; remove: (item: S) => void }]
  : [S[], { add: (item: S) => void; remove: (item: S) => void }] {
  const comparePropetyRef = useRef(compareProperty);
  const [state, setState] = useState(defaultState);

  const add = useCallback((item: S) => {
    setState((prevState) => {
      const key = comparePropetyRef.current[0];
      if (typeof item === "object" && key) {
        const exists = prevState.some((i) => i[key] === item[key]);
        if (exists) return prevState;
      }
      return [...prevState, item];
    });
  }, []);

  const update = useCallback((item: S) => {
    setState((prevState) => {
      const copyState = [...prevState];
      let index: number;
      const key = comparePropetyRef.current[0];
      if (typeof item === "object" && key) {
        index = copyState.findIndex((i) => i[key] === item[key]);
      } else {
        index = copyState.indexOf(item);
      }
      if (index !== -1) {
        copyState.splice(index, 1, item);
      }
      return copyState;
    });
  }, []);

  const remove = useCallback((item: S) => {
    const key = comparePropetyRef.current[0];
    setState((prevState) => {
      return prevState.filter((i) => {
        if (typeof item === "object" && key) {
          return i[key] !== item[key];
        }
        return i !== item;
      });
    });
  }, []);

  if (typeof state === "object") {
    return [state, { add, update, remove }] as any;
  }

  return [state, { add, remove }] as any;
}
