import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

type PrimitiveSetFunctions<T> = {
  set: Dispatch<SetStateAction<T[]>>;
  add: (item: T) => void;
  remove: (item: T) => void;
};
type ObjectSetFunctions<T> = {
  set: Dispatch<SetStateAction<T[]>>;
  add: (item: T) => void;
  update: (item: T) => void;
  remove: (item: T) => void;
};

/**
 * Custom hook that handle list states and exposes set functions which
 * can be used to update the state without mutating it.
 * @param defaultState initial list of values.
 * @param compareKey key used to compare if two objects are the same.
 * @returns a tuple with the list state and an object containing all set functions.
 */
export function useListState<T>(
  defaultState?: T[],
  ...compareKey: T extends object ? [v: keyof T] : [v?: never]
): T extends object ? [T[], ObjectSetFunctions<T>] : [T[], PrimitiveSetFunctions<T>];
export function useListState<T>(
  defaultState?: T[],
  ...compareKey: T extends object ? [v: keyof T] : [v?: never]
): [T[], ObjectSetFunctions<T>] | [T[], PrimitiveSetFunctions<T>] {
  const comparePropetyRef = useRef(compareKey);
  const [state, set] = useState(defaultState || []);

  const add = useCallback((item: T) => {
    set((prevState) => {
      const key = comparePropetyRef.current[0];
      if (typeof item === "object" && key) {
        const exists = prevState.some((i) => i[key] === item[key]);
        if (exists) return prevState;
      }
      return [...prevState, item];
    });
  }, []);

  const update = useCallback((item: T) => {
    set((prevState) => {
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

  const remove = useCallback((item: T) => {
    const key = comparePropetyRef.current[0];
    set((prevState) => {
      return prevState.filter((i) => {
        if (typeof item === "object" && key) {
          return i[key] !== item[key];
        }
        return i !== item;
      });
    });
  }, []);

  return [state, { set, add, update, remove }];
}
