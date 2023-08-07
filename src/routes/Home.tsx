import Search from "../components/Search";
import axios from "axios";
import "../index.css";

function Home() {
  const convertValue = async (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/convert5/exchange",
        {
          amount,
          base: fromCurrency,
          symbols: toCurrency,
        }
      );

      const data = response.data;

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Search convertValue={convertValue} />
      {/* <h2>Graphs</h2> */}
    </div>
  );
}

export default Home;
