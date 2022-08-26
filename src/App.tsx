import "./App.css";
import { useListState } from "./useListState";

interface User {
  id: string;
  name: string;
  becameMember: Date;
}

const defaultUsers: User[] = [
  { id: "1", name: "David", becameMember: new Date() },
  { id: "2", name: "Olivia", becameMember: new Date() },
];

function App() {
  const [users, setUsers] = useListState<User>(defaultUsers, "id");
  const [messages, setMessages] = useListState(["hello"]);

  const addMessage = () => setMessages.add("test");
  const removeMessage = () => setMessages.remove("test");

  const addUser = () => setUsers.add({ id: "3", name: "My", becameMember: new Date() });
  const updateUser = () => setUsers.update({ id: "3", name: "Spacy", becameMember: new Date() });
  const removeUser = () => setUsers.remove({ id: "3", name: "My", becameMember: new Date() });

  return (
    <div className="App">
      <h1>Demo list hook</h1>
      <h2>Primitives (message)</h2>
      <ul style={{ listStyleType: "none", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <button onClick={addMessage}>Add message</button>
      <button onClick={removeMessage}>Remove message</button>

      <h2>Objects (user)</h2>
      <ul style={{ listStyleType: "none" }}>
        {users.map((u) => (
          <li key={u.id}>
            {u.id} {u.name} {u.becameMember.toTimeString()}
          </li>
        ))}
      </ul>
      <button onClick={addUser}>Add User</button>
      <button onClick={updateUser}>Update User</button>
      <button onClick={removeUser}>Remove User</button>
    </div>
  );
}

export default App;
