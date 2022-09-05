# Useful state hooks

Useful React hooks written in Typescript. They handle the same type of states as the normal useState hook but with a few every day coding improvements.

## Installation

```
npm install useful-state-hooks
```

## Hooks

- [useLocalStorageState](#use-local-storage-state) - sync your state with local storage.
- [useListState](#use-list-state) - work with lists without worrying about mutations.
- [useDebounceState](#use-debounce-state) - delay execution of state related actions.

### <a name="use-local-storage-state"></a>UseLocalStorageState

Syncs the state with localstorage. It has almost the same signature as the normal useState hook accepting primitives, dates, arrays and objects as initial state.

```
const [count, setCount] = useLocalStorageState("count", 1);
```

It takes two arguments. First argument is the localstorage key, while the second argument is the initial state. The following rules apply:

- Data stored in localstorage will be prioritized over initial state.
- Date objects are revived (recreated from strings) when loaded from localstorage.

### <a name="use-list-state"></a>UseListState

Was created to ease the headaches caused by mutations when working with arrays. Instead of returning a set function as the second tuple value, it returns an object with multiple set functions which can be used to update the state without mutating it.

Use hook like this:

```
const [words, setWords] = useListState(['Lorem', 'Ipsum']);
```

Apart from the normal `set` function, there are four more functions that can be used to set the state.

- `add`, `update`, `remove` and `sort`.

- They will change the state without introducing duplicates.

When **working with objects** a second argument must be passed in to the hook, defining a key. The hook can then use that key to check equality of objects.

```
const [users, setUsers] = useListState([
  { id: 1, name: "My" }
  { id: 2, name: "Olivia" }
], 'id');
```

#### **Add**

Appends to the end of the list without introducing duplicates. Supports the spread operator as well.

```
setWords.add(['Foo']);
// ['Lorem', 'Ipsum', 'Foo']

setWords.add(...['Foo', 'Bas', 'Ipsum']);
// ['Lorem', 'Ipsum', 'Foo', 'Bas']
```

#### **Remove**

Removes all matching item from the list.

```
setWords.remove(['Lorem']);
// ['Ipsum']
```

#### **Set**

This is just the normal React set function re-exposed (which can introduce duplicates).

```
setWords.set(['New list']);
// ['New List']
```

#### **Sort**

Sorts an array ascending or descending.

```
setWords.sort('asc');
// ['Ipsum', 'Lorem']
```

It's also possible to sort an array of objects. When doing so a second argument must be passed in defining the key to sort by.

```
setUsers.sort('desc', 'name');
```

#### **Update (objects only)**

Uses the key that was passed in when calling the hook to update the correct object in the array.

```
const [users, setUsers] = useListState([
  { id: 1, name: 'My' }
], 'id');

setUsers.update({ id: 1, name: 'Olivia' });
// [{ id: 1, name: 'Olivia' }]
```

### <a name="use-debounce-state"></a>UseDebounceState

This hook is useful when you want to update a state often but not trigger related actions at same rate. Multiple state updates in a row within the delay window will only result in the callback being fired once. The callback will be invoked, with the latest state value, when no state updates has happened for the given delay.

```
const [query, setQuery] = useDebounceState((query) => {
  // Called when state updates has paused for 2 seconds.
}, 'useful react hooks', 2000);
```

> **Usecase:**\
> A user types into a field which updates the state as normal but other actions like calling an API or calculating expensive things might be better to do when the user stops typing for a short period.

**It takes three arguments**

1. Debounce callback
2. Initial state
3. Delay (defaults to 1000 millisecons).

Both the initial state and the delay are optional:

```
const [query, setQuery] = useDebounceState((query) => {
  // Call API or do expensive operations...
});
```

It's even possible to destruct a third value from the tuple - a debounce object.

The returned debounce object contains two functions, `flush` and `cancel`. Calling flush will call onDebounce immediately and calling cancel will prevent it from running - useful when your components are unmounting.

```
const [query, setQuery, debounce] = useDebounceState(
  (query) => {
    // Call API or do expensive operations...
  }
);

// ----- do -----

useEffect(() => {
  // Make sure callback runs before component unmounts.
  return debounce.flush
}, [])

// ----- or -----

useEffect(() => {
  // Prevent callback from running after component has unmounted.
  return debounce.cancel
}, [])

```

## Support

If you find and bugs please report an issue so it can be fixed. Do you have any suggestions that would improve the hooks please let me now. Feel free to contribute in any way!

**I hope this can be useful for you in some way, enjoy =)**
