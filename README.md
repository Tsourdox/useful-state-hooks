# Two useful react state hooks

Both hooks are written in Typescript and should handle the same type of states as the normal useState hook.

## Installation (not published yet)

```
npm install useful-state-hooks
```

---

## Docs & Usage

### UseLocalStorageState

Syncs the state with localstorage. It has almost the same signature as the normal useState hook accepting primitives, dates, arrays and objects as initial state.

It takes two arguments. First argument is the localstorage key, while the second argument is the initial state.

```
const [count, setCount] = useLocalStorageState("count", 1);
```

Data stored in localstorage will be prioritized over initial state.

Date objects are revived (recreated from strings) when loaded from localstorage for ease of use.

---

### UseListState

The other hook is called `useListState` and is meant to make it easer to work with and update array states. This is done by exposing more set functions that updates the state without mutating the original state array.

Use hook like so:

```
const [messages, setMessages] = useListState(['Lorem', 'Ipsum']);
```

Apart from the normal `set` function, there are four more functions that can be used to set the state.

These are `add`, `update`, `remove` and `sort`.

#### **Add**

Appends to the end of the list. Supports the spread operator aswell. Will not add the value to the list if it is already in it, preventing duplicates.

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

This is just the normal react set function re-exposed.

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

It's also possible to sort array of objects. When doing so a second argument must be passed in defining the key to sort by.

```
setUsers.sort('desc', 'name');
```

#### **Update (objects only)**

Lastly is the update function which is only available for array of objects.

```
const [users, setUsers] = useListState([{ id: 1, name: 'Olivia' }], 'id');

setUsers.update({ id: 1, name: 'My' });
// [{ id: 1, name: 'My' }]
```

_When working with objects a second argument must be passed in to the hook. This argument defines the key to compare objects by and is used by the add, remove and update functions._
