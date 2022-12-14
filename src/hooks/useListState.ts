import { Dispatch, SetStateAction, useRef, useState } from 'react';

// Convenience types
type Primitive = string | number | boolean | bigint | symbol;
type InitialState<S> = S | (() => S);
type Key<S> = S extends Date ? undefined : keyof S;

// Set functions
type PrimitiveSetFunctions<S> = {
  set: Dispatch<SetStateAction<S[] | undefined>>;
  add: (...items: S[]) => void;
  remove: (item: S) => void;
  sort: (direction?: 'asc' | 'desc') => void;
};
type ObjectSetFunctions<S> = {
  set: Dispatch<SetStateAction<S[] | undefined>>;
  add: (...items: S[]) => void;
  update: (item: S) => void;
  remove: (item: S) => void;
  sort: (direction: 'asc' | 'desc', by: keyof S) => void;
};
type SelectSetFunctions<S> = S extends object ? ObjectSetFunctions<S> : PrimitiveSetFunctions<S>;

/**
 * An extended version of the setState hook for lists that export additional some set functions.
 * These functions can be used to update the state without mutating it.
 * @param initialState used to set a default state to start with.
 * @param key used to compare object equality, can't be changed.
 *
 * DEV_NOTE: Passing a primitive list as initialState without adding a generics argument causes it to
 * be inferred as a union type, for example (1 | 2)[] instead of number[] - how can this be fixed?
 */
// Overload signatures
export function useListState<S extends object>(
  initialState: InitialState<S[]>,
  key: Key<S>
): [S[], ObjectSetFunctions<S>];
export function useListState<S extends Primitive>(
  initialState: InitialState<S[]>
): [S[], PrimitiveSetFunctions<S>];
export function useListState<S extends Date>(
  initialState: InitialState<S[]>
): [S[], PrimitiveSetFunctions<S>];
export function useListState<S = undefined>(): [S[] | undefined, SelectSetFunctions<S>];

// Implementation
export function useListState<S>(
  initialState?: InitialState<S[]>,
  key?: keyof S | undefined
): [S[] | undefined, ObjectSetFunctions<S> | PrimitiveSetFunctions<S>] {
  const [state, setState] = useState(initialState);

  const setStateObject = useRef({
    set: setState,
    add: (...items: S[]) => {
      setState((prevState = []) => {
        const removedDuplicates = items.filter(
          (item) => !prevState?.some((stateItem) => isEqual(stateItem, item, key))
        );
        return [...prevState, ...removedDuplicates];
      });
    },
    update: (item: S) => {
      setState((prevState = []) => {
        const copyState = [...prevState];
        const index = copyState.findIndex((i) => isEqual(i, item, key));
        if (index !== -1) {
          copyState.splice(index, 1, item);
        }
        return copyState;
      });
    },
    remove: (item: S) => {
      setState((prevState) => prevState?.filter((i) => !isEqual(i, item, key)));
    },
    sort: (direction: 'asc' | 'desc' = 'asc', key?: keyof S | undefined) => {
      setState((prevState = []) => {
        const copyState = [...prevState];
        copyState.sort((a, b) => {
          const aa = key ? a[key] : a;
          const bb = key ? b[key] : b;
          if (direction === 'asc') {
            return aa > bb ? 1 : -1;
          }
          return aa < bb ? 1 : -1;
        });
        return copyState;
      });
    },
  });

  return [state, setStateObject.current];
}

/** Determines if two list items are the same */
function isEqual<S>(item1: S, item2: S, key?: keyof S): boolean {
  if (key) {
    return item1[key] === item2[key];
  }
  if (item1 instanceof Date && item2 instanceof Date) {
    return item1.getTime() === item2.getTime();
  }
  return item1 === item2;
}
