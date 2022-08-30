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
    const { result } = renderHook(() => useListState([1, 2, 3]));
    const [state] = result.current;
    expect(state).toEqual([1, 2, 3]);
  });
  it("should set state to the same object list that was passed in as initial state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "12345" }], "id"));
    const [state] = result.current;
    expect(state).toStrictEqual([{ id: "12345" }]);
  });
  it("should set state to the same date list that was passed in as initial state", () => {
    const initialState = [new Date("2022-08-01"), new Date("2022-09-01"), new Date("2022-10-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [state] = result.current;
    const expectedState = initialState;
    expect(state).toStrictEqual(expectedState);
  });
});

describe("updating primitive states", () => {
  it("should be able to set a primitive list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.set([4, 5, 6]));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([4, 5, 6]);
  });
  it("should be able to add a primitive to the list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.add(4));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 2, 3, 4]);
  });
  it("should not add primitives to the list state if it they already exist", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.add(1));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 2, 3]);
  });
  it("should be able to add primitives to the list state using the spread operator", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.add(...[4, 5, 6]));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });
  it("should be able to remove a primitive to the list state", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.remove(2));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 3]);
  });
  it("should not change the state when trying to remove a primitive that does not exist", () => {
    const { result } = renderHook(() => useListState<number>([1, 2, 3]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.remove(5));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 2, 3]);
  });
  it("should be able to sort primitive list state ascending", () => {
    const { result } = renderHook(() => useListState<number>([2, 3, 1]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.sort());

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([1, 2, 3]);
  });
  it("should be able to sort primitive list state descending", () => {
    const { result } = renderHook(() => useListState<number>([2, 3, 1]));
    const [_, setNumbers] = result.current;
    act(() => setNumbers.sort("desc"));

    const [numbers] = result.current;
    expect(numbers).toStrictEqual([3, 2, 1]);
  });
});

describe("updating object states", () => {
  it("should be able to set an object list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.set([{ id: "456" }]));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "456" }]);
  });
  it("should be able to add an object to the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.add({ id: "456" }));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123" }, { id: "456" }]);
  });
  it("should not add objects to the list state if they already exists", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.add({ id: "123" }));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123" }]);
  });
  it("should be able to add objects to the list state using the spread operator", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }], "id"));
    const [_, setUsers] = result.current;
    const newUsers: User[] = [{ id: "456" }, { id: "789" }];
    act(() => setUsers.add(...newUsers));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123" }, { id: "456" }, { id: "789" }]);
  });
  it("should be able to update an object in the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123", name: "My" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.update({ id: "123", name: "Olivia" }));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123", name: "Olivia" }]);
  });
  it("should not change the state when trying to update an object that does not exist", () => {
    const initialState = [{ id: "123", name: "My" }];
    const { result } = renderHook(() => useListState<User>(initialState, "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.update({ id: "999", name: "Olivia" }));

    const [users] = result.current;
    expect(users).toStrictEqual(initialState);
  });
  it("should be able to remove an object from the list state", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }, { id: "456" }, { id: "789" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.remove({ id: "456" }));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123" }, { id: "789" }]);
  });
  it("should not change the state when trying to remove an object that does not exist", () => {
    const { result } = renderHook(() => useListState<User>([{ id: "123" }, { id: "456" }, { id: "789" }], "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.remove({ id: "000" }));

    const [users] = result.current;
    expect(users).toStrictEqual([{ id: "123" }, { id: "456" }, { id: "789" }]);
  });
  it("should be able to sort list object state ascending by object key", () => {
    const initialState = [
      { id: "1", name: "Olivia" },
      { id: "2", name: "David" },
      { id: "3", name: "My" },
    ];
    const { result } = renderHook(() => useListState<User>(initialState, "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.sort("asc", "name"));

    const [users] = result.current;
    expect(users).toStrictEqual([
      { id: "2", name: "David" },
      { id: "3", name: "My" },
      { id: "1", name: "Olivia" },
    ]);
  });
  it("should be able to sort object list state descending by object key", () => {
    const initialState = [
      { id: "1", name: "Olivia" },
      { id: "2", name: "David" },
      { id: "3", name: "My" },
    ];
    const { result } = renderHook(() => useListState<User>(initialState, "id"));
    const [_, setUsers] = result.current;
    act(() => setUsers.sort("desc", "name"));

    const [users] = result.current;
    expect(users).toStrictEqual([
      { id: "1", name: "Olivia" },
      { id: "3", name: "My" },
      { id: "2", name: "David" },
    ]);
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
  it("should be able to sort date list state ascending", () => {
    const initialState = [new Date("2022-09-01"), new Date("2022-010-01"), new Date("2022-08-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;
    act(() => setDates.sort());

    const [dates] = result.current;
    const expectedState = [new Date("2022-08-01"), new Date("2022-09-01"), new Date("2022-010-01")];
    expect(dates).toStrictEqual(expectedState);
  });
  it("should be able to sort date list state descending", () => {
    const initialState = [new Date("2022-09-01"), new Date("2022-10-01"), new Date("2022-08-01")];
    const { result } = renderHook(() => useListState(initialState));
    const [_, setDates] = result.current;
    act(() => setDates.sort("desc"));

    const [dates] = result.current;
    const expectedState = [new Date("2022-10-01"), new Date("2022-09-01"), new Date("2022-08-01")];
    expect(dates).toStrictEqual(expectedState);
  });
});
