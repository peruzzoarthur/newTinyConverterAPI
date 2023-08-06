import { Outlet } from "react-router-dom";
import "./index.css";

const App = () => {
  return (
    <main className="flex justify-center items-center bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
      <Outlet />
    </main>
  );
};

export default App;
