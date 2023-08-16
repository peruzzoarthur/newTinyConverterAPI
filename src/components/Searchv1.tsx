import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";
import tiny from "../img/tiny.png";
// import ConvertButton from "./ConvertButton";
import GraphButton from "./GraphButton";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import CryptoList from "./CryptoList";
import OnOffCrypto from "./OnOffCrypto";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Search() {
  const [amount, setAmount] = useState<number>();
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number>(-pi);
  const [isConversionDone, setIsConversionDone] = useState<boolean>(false);
  const [initialFromCurrency, setInitialFromCurrency] = useState<string>("");
  const [initialToCurrency, setInitialToCurrency] = useState<string>("");
  const [initialAmount, setInitialAmount] = useState<number>(1);
  const [graphDays, setGraphDays] = useState<string[]>([]);
  const [graphValues, setGraphValues] = useState<number[]>([]);
  const [isgraphData, setIsGraphData] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<number>(0);
  const [isTimeFrameUpdated, setIsTimeFrameUpdated] = useState<boolean>(false);
  const [isGraphBuilt, setIsGraphBuilt] = useState<boolean>(false);
  const [chartData, setChartData] = useState<Chart | any>();
  const [chartConfig, setChartConfig] = useState<Chart | any>();
  const [cryptoEnabled, setCryptoEnabled] = useState<boolean>(false);

  async function handleConvertValue(): Promise<void> {
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
      setIsConversionDone(true);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  useEffect(() => {
    handleConvertValue();
  }),
    [amount, fromCurrency, toCurrency];

  async function handleGraphData(): Promise<void> {
    if (isConversionDone) {
      try {
        const response = await axios.post("http://localhost:3000/buildgraph", {
          amount: amount,
          base: fromCurrency,
          symbols: toCurrency,
          timeFrame: timeFrame,
        });
        const data = response.data.data;
        const days = Object.keys(data);
        const values = days.map((date) => data[date][toCurrency]);
        setGraphDays(days);
        setGraphValues(values);
        setIsGraphData(true);
      } catch (error) {
        console.error("Error:", (error as Error).message);
      }
    }
  }

  useEffect(() => {
    if (isConversionDone) {
      handleGraphData();
    }
  }, [isConversionDone, amount, fromCurrency, toCurrency, timeFrame]);

  async function handleGraphBuilding(): Promise<void> {
    const graphData = {
      labels: graphDays,
      datasets: [
        {
          label: "Currency Conversion",
          data: graphValues,
          borderColor: "#000000",
          pointBackgroundColor: "#B1B1B1",
        },
      ],
    };
    const config = {
      type: "line",
      data: chartData,
    };
    setChartData(graphData);
    setChartConfig(config);
    setIsGraphBuilt(true);
  }

  useLayoutEffect(() => {
    if (isgraphData) {
      handleGraphBuilding();
    }
  }, [graphDays, graphValues, isgraphData]);

  async function handleUpdateTimeFrame(newTimeFrame: number) {
    setTimeFrame(newTimeFrame);
    setIsTimeFrameUpdated(true);
  }

  async function handleUpdateTimeButtonClick(newTimeFrame: number) {
    await handleUpdateTimeFrame(newTimeFrame);
  }

  return (
    <main className="flex justify-center items-center h-[100vh] w-full">
      <section
        className="w-full md:max-w-[600px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-20 h-full 
      lg:h-[880px] bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-slate-200"
      >
        <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        <span className="text-2xl font-black">Converting Calculator</span>
        <img src={tiny} alt="I Only Grow" width={300} />
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
          {/* <ConvertButton onClick={handleConvertButtonClick}></ConvertButton> */}
        </div>

        {convertedAmount !== -pi && isConversionDone && (
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

        {isGraphBuilt && isConversionDone && (
          <section
            className="w-7000 full md:max-w-[500px] p-4 text-lg items-center 
          justify-center md:px-10 lg:p-2 h-500 lg:h-[500px] bg-white bg-opacity-40 backdrop-blur-lg 
          drop-shadow-lg rounded text-zinc-700 mt-4"
          >
            <div>
              <Line data={chartData} options={chartConfig} />
            </div>
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365)}
              text="1 YEAR"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(180)}
              text="6 MONTHS"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(90)}
              text="3 MONTHS"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(30)}
              text="1 MONTH"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(15)}
              text="15 DAYS"
            />
          </section>
        )}
      </section>
      <CryptoList
        selectedCurrency={toCurrency}
        setSelectedCurrency={setToCurrency}
      />
      <OnOffCrypto
        cryptoEnabled={cryptoEnabled}
        setCryptoEnabled={setCryptoEnabled}
      />
    </main>
  );
}

export default Search;
