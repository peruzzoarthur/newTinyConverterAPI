import Search from "./components/Search";
import backgroundImage from "./img/gradient.jpeg";
import "./index.css";

const App = () => {
  return (
    <main
      className="flex justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Search />
    </main>
  );
};

export default App;
