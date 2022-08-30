import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useListState from "../hooks/useListState";

interface User {
  id: string;
  name?: string;
}

describe("initial state", () => {
  it("should set state to undeinfed when used without an initial state", () => {
    const { result } = renderHook(() => useListState<string>());
    const [state] = result.current;
    expect(state).toBe(undefined);
  });
  it("should set state to the same primitive list that was passed in as initial state", () => {
    const { result } = renderHook(() => useListState(["list item"]));
    const [state] = result.current;
    expect(state).toEqual(["list item"]);
  });
  it("should set state to the same object list that was passed in as initial state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "12345" }], "id"));
    const [state] = result.current;
    expect(state).toStrictEqual([{ id: "12345" }]);
  });
  it("should set state to the same array that was passed in as initial state", () => {
    const { result } = renderHook(() => useListState([1, 2, 3]));
    const [state] = result.current;
    expect(state).toStrictEqual([1, 2, 3]);
  });
});

describe("updating primitive states", () => {
  it("should be able to set a primitive list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.set([4, 5, 6]));

    const [message] = result.current;
    expect(message).toStrictEqual([4, 5, 6]);
  });
  it("should be able to add a primitive to the list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.add(4));

    const [message] = result.current;
    expect(message).toStrictEqual([1, 2, 3, 4]);
  });
  it("should not add primitives to the list state if it they already exist", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.add(1));

    const [message] = result.current;
    expect(message).toStrictEqual([1, 2, 3]);
  });
  it("should be able to add primitives to the list state using the spread operator", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.add(...[4, 5, 6]));

    const [message] = result.current;
    expect(message).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });
  it("should be able to remove a primitive to the list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.remove(2));

    const [message] = result.current;
    expect(message).toStrictEqual([1, 3]);
  });
  it("should not change the state when trying to remove a primitive that does not exist", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setMessage] = result.current;
    act(() => setMessage.remove(5));

    const [message] = result.current;
    expect(message).toStrictEqual([1, 2, 3]);
  });
});

describe("updating object states", () => {
  it("should be able to set an object list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.set([{ id: "456" }]));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "456" }]);
  });
  it("should be able to add an object to the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.add({ id: "456" }));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123" }, { id: "456" }]);
  });
  it("should not add objects to the list state if they already exists", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.add({ id: "123" }));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123" }]);
  });
  it("should be able to add objects to the list state using the spread operator", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setMessage] = result.current;
    const users: User[] = [{ id: "456" }, { id: "789" }];
    act(() => setMessage.add(...users));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123" }, { id: "456" }, { id: "789" }]);
  });
  it("should be able to update an object in the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123", name: "My" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.update({ id: "123", name: "Olivia" }));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123", name: "Olivia" }]);
  });
  it("should not change the state when trying to update an object that does not exist", () => {
    const initialState = [{ id: "123", name: "My" }];
    const { result } = renderHook(() => useListState<User>(initialState, "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.update({ id: "999", name: "Olivia" }));

    const [message] = result.current;
    expect(message).toStrictEqual(initialState);
  });
  it("should be able to remove an object from the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }, { id: "456" }, { id: "789" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.remove({ id: "456" }));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123" }, { id: "789" }]);
  });
  it("should not change the state when trying to remove an object that does not exist", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }, { id: "456" }, { id: "789" }], "id"));
    const [_, setMessage] = result.current;
    act(() => setMessage.remove({ id: "000" }));

    const [message] = result.current;
    expect(message).toStrictEqual([{ id: "123" }, { id: "456" }, { id: "789" }]);
  });
});

describe("updating date states", () => {
  it("should be able to set a date list state", () => {
    const { result } = renderHook(() => useListState<Date>());
    const [_, setDates] = result.current;

    const nextDate = new Date();
    act(() => setDates.set([nextDate]));

    const [dates] = result.current;
    expect(dates).toStrictEqual([nextDate]);
  });
  it("should be able to add a date to the list state", () => {
    const initialState = [new Date("2022-09-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;

    const nextDate = new Date("2022-10-01");
    act(() => setDates.add(nextDate));

    const [dates] = result.current;
    expect(dates).toStrictEqual([...initialState, nextDate]);
  });
  it("should not add dates to the list state if they already exist", () => {
    const initialState = [new Date("2022-09-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;

    const nextDate = new Date("2022-09-01");
    act(() => setDates.add(nextDate));

    const [dates] = result.current;
    expect(dates).toStrictEqual(initialState);
  });
  it("should be able to add dates to the list state using the spread operator", () => {
    const initialState = [new Date("2022-08-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;

    const nextDates = [new Date("2022-09-01"), new Date("2022-10-01")];
    act(() => setDates.add(...nextDates));

    const [dates] = result.current;
    expect(dates).toStrictEqual([...initialState, ...nextDates]);
  });
  it("should be able to remove a date from the list state", () => {
    const initialState = [new Date("2022-08-01"), new Date("2022-09-01"), new Date("2022-10-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;
    act(() => setDates.remove(new Date("2022-09-01")));

    const [dates] = result.current;
    expect(dates).toStrictEqual([new Date("2022-08-01"), new Date("2022-10-01")]);
  });
  it("should not change the state when trying to remove a date that does not exist", () => {
    const initialState = [new Date("2022-08-01"), new Date("2022-09-01"), new Date("2022-10-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;
    act(() => setDates.remove(new Date("1999-09-09")));

    const [dates] = result.current;
    expect(dates).toStrictEqual(initialState);
  });
});
