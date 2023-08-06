import { Outlet } from "react-router-dom";
import "./index.css";

const App = () => {
  return (
    <main className="flex justify-center items-center bg-gradient-to-b from-sky-400 to-sky-200 h-[100vh] w-full">
      <h1 className="text-lime-500">The New Tiny Converter</h1>
      <Outlet />
    </main>
  );
};

export default App;
