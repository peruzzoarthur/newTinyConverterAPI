import { useState, useEffect, useRef } from "react";
import { TERipple } from "tw-elements-react";
import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";
import { Chart, initTE } from "tw-elements";
import tiny from "../img/tiny.png";

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
  const [timeFrame, setTimeFrame] = useState<number>(30);

  async function handleGraphBuilding() {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/buildgraph", {
        amount: amount,
        base: fromCurrency,
        symbols: toCurrency,
        timeFrame: timeFrame,
      });
      setTimeFrame(31);
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

  async function handleUpdateTimeFrame(newTimeFrame: number) {
    setIsGraphBuilt(false);
    setTimeFrame(newTimeFrame);
  }

  useEffect(() => {
    if (conversionDone && timeFrame !== 666) {
      handleGraphBuilding();
    }
  }, [conversionDone, timeFrame]);

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
      setTimeFrame(30);
      await handleGraphBuilding();
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  async function handleConvertButtonClick() {
    setTimeFrame(30);
    setConversionDone(false);
    setIsGraphBuilt(false);
    await handleConvertValue();
    await handleGraphBuilding();
  }

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
              borderColor: "#000000",
              pointBackgroundColor: "#B1B1B1",
            },
          ],
        },
      });
    }
  }, [isGraphBuilt, graphDays, graphValues]);

  return (
    <main className="flex justify-center items-center h-[100vh] w-full">
      <section
        className="w-full md:max-w-[600px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-20 h-full 
      lg:h-[880px] bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-slate-200"
      >
        <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        <span className="text-2xl font-black">Converting Calculator</span>
        <img src={tiny} alt={tiny} width={300} />
        <p className="text-sm mt-1">
          Choose value and currencies for conversion:
        </p>

        <div className="flex flex-row items-center">
          <div className="mr-4">
            <p className="text-sm mt-2">From Currency:</p>
            <CurrenciesList
              selectedCurrency={fromCurrency}
              setSelectedCurrency={setFromCurrency}
            />
          </div>
          <div className="mr-4">
            <p className="text-sm mt-2">To Currency:</p>
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
              className="relative mb-2 w-28 h-10 cursor-default rounded-lg
              bg-stone-600 py-3 pl-4 pr-2 text-right shadow-md focus:outline-none
               focus-visible:border-black focus-visible:ring-2
                focus-visible:ring-white focus-visible:ring-opacity-75 
                focus-visible:ring-offset-2 focus-visible:ring-offset-black
                sm:text-sm"
            />
          </div>
          <TERipple>
            <button
              onClick={handleConvertButtonClick}
              type="button"
              className="mt-7 inline-block rounded bg-stone-100 px-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal
             text-black shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 
             hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
              focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
              focus:outline-none focus:ring-0 active:bg-neutral-400 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
              dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
              dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
            >
              💸 Convert 💸
            </button>
          </TERipple>
        </div>

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

        {isGraphBuilt && conversionDone && (
          <section
            className="w-7000 full md:max-w-[500px] p-4 text-lg items-center 
          justify-center md:px-10 lg:p-2 h-500 lg:h-[500px] bg-white bg-opacity-40 backdrop-blur-lg 
          drop-shadow-lg rounded text-zinc-700 mt-4"
          >
            <div>
              <canvas
                ref={chartCanvasRef}
                data-te-chart="line"
                data-te-dataset-label="Conversion value"
                data-te-labels={JSON.stringify(graphDays)}
                data-te-dataset-data={JSON.stringify(graphValues)}
                width={700}
              ></canvas>
            </div>
            <TERipple>
              <button
                onClick={() => handleUpdateTimeFrame(365)}
                type="button"
                className="inline-block rounded bg-neutral-100 px-2 
                mt-2 pb-2 pt-2.5 text-xs font-medium uppercase l
                eading-normal text-neutral-700 shadow-[0_4px_9px_-4px_#cbcbcb] 
                transition duration-150 ease-in-out hover:bg-neutral-100 
                hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                 focus:bg-neutral-100 
                focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
                focus:outline-none focus:ring-0 active:bg-neutral-200 
                active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] 
                dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
              >
                1 year
              </button>
            </TERipple>
            <TERipple>
              <button
                onClick={() => handleUpdateTimeFrame(180)}
                type="button"
                className="ml-2 inline-block rounded bg-neutral-100 px-2 
                mt-2 pb-2 pt-2.5 text-xs font-medium uppercase l
                eading-normal text-neutral-700 shadow-[0_4px_9px_-4px_#cbcbcb] 
                transition duration-150 ease-in-out hover:bg-neutral-100 
                hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                 focus:bg-neutral-100 
                focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
                focus:outline-none focus:ring-0 active:bg-neutral-200 
                active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] 
                dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
              >
                6 months
              </button>
            </TERipple>
            <TERipple>
              <button
                onClick={() => handleUpdateTimeFrame(30)}
                type="button"
                className="ml-2 inline-block rounded bg-neutral-100 px-2 
                mt-2 pb-2 pt-2.5 text-xs font-medium uppercase l
                eading-normal text-neutral-700 shadow-[0_4px_9px_-4px_#cbcbcb] 
                transition duration-150 ease-in-out hover:bg-neutral-100 
                hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                 focus:bg-neutral-100 
                focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] 
                focus:outline-none focus:ring-0 active:bg-neutral-200 
                active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]
                dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] 
                dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] 
                dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
              >
                30 days
              </button>
            </TERipple>
          </section>
        )}
      </section>
    </main>
  );
}

export default Search;
