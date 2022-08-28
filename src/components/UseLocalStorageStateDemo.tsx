import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface User {
  id: string;
  name: string;
  becameMember: Date;
}

const defaultUsers: User[] = [
  { id: "1", name: "David", becameMember: new Date() },
  { id: "2", name: "Olivia", becameMember: new Date() },
];

function UseLocalStorageStateDemo() {
  const [name, setName] = useLocalStorageState<string>("name");
  const [isDarkMode, setIsDarkMode] = useLocalStorageState("name", true);

  const addName = () => setName("David");
  const removeName = () => setName(undefined);
  const toggleTheme = () => setIsDarkMode((prevState) => !prevState);

  return (
    <div>
      <h1>useLocalStorageState</h1>

      <h2>Without initial state</h2>
      <p>{name}</p>
      <button onClick={addName}>Add name</button>
      <button onClick={removeName}>Remove name</button>

      <h2>With initial state</h2>
      <p>{isDarkMode.toString()}</p>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

export default UseLocalStorageStateDemo;
