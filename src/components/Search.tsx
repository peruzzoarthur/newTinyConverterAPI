import { useState, useEffect, useRef } from "react";
import { TERipple } from "tw-elements-react";
import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";
import { Chart, initTE } from "tw-elements";

function Search() {
  const [amount, setAmount] = useState<number>();
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState<number>(-pi);
  const [conversionDone, setConversionDone] = useState(false);
  const [initialFromCurrency, setInitialFromCurrency] = useState("");
  const [initialToCurrency, setInitialToCurrency] = useState("");
  const [initialAmount, setInitialAmount] = useState<number>(1);
  const [graphDays, setGraphDays] = useState<string[]>([]);
  const [graphValues, setGraphValues] = useState<number[]>([]);
  const [isGraphBuilt, setIsGraphBuilt] = useState(false);
  const chartCanvasRef = useRef(null);

  async function handleGraphBuilding() {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/buildgraph", {
        amount: amount,
        base: fromCurrency,
        symbols: toCurrency,
      });
      const data = response.data.data;
      const days = Object.keys(data);
      const values = days.map((date) => data[date][toCurrency]);
      setGraphDays(days);
      setGraphValues(values);
      setIsGraphBuilt(true);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  async function handleConvertValue() {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/convert", {
        amount: amount,
        base: fromCurrency,
        symbols: toCurrency,
      });
      const data = response.data;
      const convertedAmount = data.toAmount;
      setConvertedAmount(convertedAmount);
      setInitialFromCurrency(fromCurrency);
      setInitialToCurrency(toCurrency);
      setInitialAmount(amount);
      setConversionDone(true);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  const handleConvertButtonClick = async () => {
    setConversionDone(false);
    setIsGraphBuilt(false);
    await handleConvertValue();
    await handleGraphBuilding();
  };

  useEffect(() => {
    if (isGraphBuilt) {
      initTE({ Chart });
      const canvasElement = chartCanvasRef.current;
      new Chart(canvasElement, {
        type: "line",
        data: {
          labels: graphDays,
          datasets: [
            {
              label: "Currency Conversion",
              data: graphValues,
            },
          ],
        },
      });
    }
  }, [isGraphBuilt]);

  return (
    <main className="flex justify-center items-center h-[100vh] w-full">
      <section className="w-full md:max-w-[800px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-20 h-full lg:h-[760px] bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-zinc-700">
        <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        <span className="text-2xl font-black">Converting Calculator</span>
        <p className="text-sm mt-1">
          Choose value and currencies for conversion:
        </p>

        <div className="flex flex-row items-center">
          <div className="mr-4">
            <p className="text-sm mt-2">From currency:</p>
            <CurrenciesList
              selectedCurrency={fromCurrency}
              setSelectedCurrency={setFromCurrency}
            />
          </div>
          <div className="mr-4">
            <p className="text-sm mt-2">To currency:</p>
            <CurrenciesList
              selectedCurrency={toCurrency}
              setSelectedCurrency={setToCurrency}
            />
          </div>
          <div className="mr-4 mt-2">
            <p className="text-sm mt-2">Amount:</p>
            <input
              type="number"
              placeholder="1"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-right mb-2 w-28 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <TERipple>
          <button
            onClick={handleConvertButtonClick}
            type="button"
            className="inline-block rounded bg-neutral-100 px-2 mt-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-700 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
          >
            💸 Convert 💸
          </button>
        </TERipple>

        {convertedAmount !== -pi && conversionDone && (
          <section
            className="w-400 full md:max-w-[400px] p-4 flex flex-col text-lg 
            items-center justify-center md:px-10 lg:p-2 h-200 lg:h-[200px]
             bg-white bg-opacity-40 backdrop-blur-lg drop-shadow-lg rounded
              text-zinc-700 mt-4"
          >
            <h2 className="font-black">
              Converted Amount: {convertedAmount.toFixed(2)}
            </h2>
            <h2 className="font-thin">
              Converted from {initialFromCurrency} to {initialToCurrency} at a
              conversion rate of {(initialAmount / convertedAmount).toFixed(4)}{" "}
              to 1.
            </h2>
          </section>
        )}

        {conversionDone && (
          <section
            className="w-1000 full md:max-w-[1000px] p-4 flex flex-col text-lg items-center 
          justify-center md:px-10 lg:p-2 h-400 lg:h-[900px] bg-white bg-opacity-40 backdrop-blur-lg 
          drop-shadow-lg rounded text-zinc-700 mt-4"
          >
            <div>
              <canvas
                ref={chartCanvasRef}
                data-te-chart="line"
                data-te-dataset-label="Currency Conversion"
                data-te-labels={JSON.stringify(graphDays)}
                data-te-dataset-data={JSON.stringify(graphValues)}
              ></canvas>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default Search;
