import { Dispatch, SetStateAction, useState } from "react";

// Convenience types
type Primitive = string | number | boolean | bigint | symbol;
type InitialState<S> = S | (() => S);
type Key<S> = S extends Date ? undefined : keyof S;
type ReturnTuple<S> = [S, Dispatch<SetStateAction<S>>];

// Overload signatures
export function useListState<S extends Primitive[]>(initialState: InitialState<S>): ReturnTuple<S>; // why is extending [] allowed?
export function useListState<S extends Date>(initialState: InitialState<S[]>): ReturnTuple<S[]>;
export function useListState<S extends object>(initialState: InitialState<S[]>, key: Key<S>): ReturnTuple<S[]>;
export function useListState<S = undefined>(): ReturnTuple<S[] | undefined>;

// Implementation
export function useListState<S extends any[]>(initialState?: InitialState<S>): ReturnTuple<S | undefined> {
  const [state, setState] = useState(initialState);

  return [state, setState];
}

const [messages, setMessages] = useListState(["ooo", "iii"]);
const [numbers, setNumbers] = useListState([1, 2, 3]);
const [nothing, setNothing] = useListState<string>();

interface Person {
  name: string;
  age: number;
}

const [person, setPerson] = useListState<Person>([], "name");
const [date, setDate] = useListState<Date>([]);
