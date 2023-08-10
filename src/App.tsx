import Search from "./components/Search";

import "./index.css";

const App = () => {
  return (
    <main
      className="flex justify-center items-center 
      bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"
    >
      <Search />
    </main>
  );
};

export default App;
