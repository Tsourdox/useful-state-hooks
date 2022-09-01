# Useful state hooks

React hooks that are written in Typescript. They handle the same type of states as the normal useState hook but with a few every day coding improvements.

## Installation

```
npm install useful-state-hooks
```

## Hooks

- [useLocalStorageState ](#use-local-storage-state)
- [useListState](#use-list-state)

### UseLocalStorageState

Syncs the state with localstorage. It has almost the same signature as the normal useState hook accepting primitives, dates, arrays and objects as initial state.

```
const [count, setCount] = useLocalStorageState("count", 1);
```

It takes two arguments. First argument is the localstorage key, while the second argument is the initial state. The following rules apply:

- Data stored in localstorage will be prioritized over initial state.
- Date objects are revived (recreated from strings) when loaded from localstorage.

---

### UseListState

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

## Support

If you find and bugs please report an issue so it can be fixed. Do you have any suggestions that would improve the hooks please let me now. Feel free to contribute in any way!

**I hope this can be useful for you in some way, enjoy =)**
