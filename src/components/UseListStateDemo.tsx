import { useListState } from "../hooks/useListState";

interface User {
  id: string;
  name: string;
  becameMember: Date;
}

const defaultUsers: User[] = [
  { id: "1", name: "David", becameMember: new Date() },
  { id: "2", name: "Olivia", becameMember: new Date() },
];

function UseListStateDemo() {
  const [messages, setMessages] = useListState<string>(["Lorem"]);
  const [users, setUsers] = useListState<User>(defaultUsers, "id");

  const addMessage = () => setMessages.add("Ipsum");
  const removeMessage = () => setMessages.remove("Ipsum");
  const resetMessages = () => setMessages.set(["Hello", "Developer", "World"]);

  const addUser = () => setUsers.add({ id: "3", name: "My", becameMember: new Date() });
  const updateUser = () => setUsers.update({ id: "3", name: "Spacy", becameMember: new Date() });
  const removeUser = () => setUsers.remove({ id: "3", name: "My", becameMember: new Date() });
  const resetUsers = () => setUsers.set([{ id: "0", name: "Manooni", becameMember: new Date() }]);

  return (
    <div>
      <h1>useListState</h1>
      <h2>Primitives (message)</h2>
      <ul className="horizontal">
        {messages?.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <button onClick={addMessage}>Add message</button>
      <button onClick={removeMessage}>Remove message</button>
      <button onClick={resetMessages}>Set messages</button>

      <h2>Objects (user)</h2>
      <ul>
        {users?.map((u) => (
          <li key={u.id}>
            {u.id} {u.name} {u.becameMember.toTimeString()}
          </li>
        ))}
      </ul>
      <button onClick={addUser}>Add user</button>
      <button onClick={updateUser}>Update user</button>
      <button onClick={removeUser}>Remove user</button>
      <button onClick={resetUsers}>Set users</button>
    </div>
  );
}

export default UseListStateDemo;
