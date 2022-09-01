# Useful state hooks

A few react hooks that are written in Typescript. They handle the same type of states as the normal useState hook but with a few every day coding improvements.

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

Was created to ease the headakes of mutations when working with arrays. Instead of returning a set function as the second tuple value, it returns an object with multiple set functions which can be used to updates the state without mutating it.

Use hook like this:

```
const [messages, setMessages] = useListState(['Lorem', 'Ipsum']);
```

Apart from the normal `set` function, there are four more functions that can be used to set the state.

- `add`, `update`, `remove` and `sort`.

- They will change the state without introducing duplicates.

When **working with objects** a second argument must be passed to the hook. It defines a key which is used to check equality of two objects.

---

#### **Add**

Appends to the end of the list. Supports the spread operator aswell.

```
setMessages.add(['Foo']);
// ['Lorem', 'Ipsum', 'Foo']

setMessages.add(...['Foo', 'Bas', 'Ipsum']);
// ['Lorem', 'Ipsum', 'Foo', 'Bas']
```

#### **Remove**

Removes all matching item from the list.

```
setMessages.remove(['Lorem']);
// ['Ipsum']
```

#### **Set**

This is just the normal react set function re-exposed (can introduce duplicates).

```
setMessages.set(['New list']);
// ['New List']
```

#### **Sort**

Sorts an array ascending or descending.

```
setMessages.sort('asc');
// ['Ipsum', 'Lorem']
```

It's also possible to sort an array of objects. When doing so a second argument must be passed in defining the key to sort by.

```
setUsers.sort('desc', 'name');
```

#### **Update (objects only)**

The update function is only available for array of objects.

```
const [users, setUsers] = useListState([{ id: 1, name: 'Olivia' }], 'id');

setUsers.update({ id: 1, name: 'My' });
// [{ id: 1, name: 'My' }]
```
