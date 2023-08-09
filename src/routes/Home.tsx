import Search from "../components/Search";
import axios from "axios";
import "../index.css";
import BuildGraph from "../components/BuildGraph";

function Home() {
  const convertValue = async (
    amount: number | undefined,
    fromCurrency: string,
    toCurrency: string
  ) => {
    try {
      const response = await axios.post("http://localhost:3000/buildgraph", {
        amount,
        base: fromCurrency,
        symbols: toCurrency,
      });

      const data = response.data;

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Search convertValue={convertValue} />
      {/* <BuildGraph convertValue={convertValue} /> */}
    </div>
  );
}

export default Home;
