import { useState, useEffect } from "react";
import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";
import tiny from "../img/tiny.png";
import tiny2 from "../img/tiny2.png";
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
import greyBackgroundImage from "../img/gradient.jpeg";
import cryptoBackgroundImage from "../img/testBackground.jpeg";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Search() {
  const [amount, setAmount] = useState<number>();
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number>(-pi);
  const [initialFromCurrency, setInitialFromCurrency] = useState<string>("");
  const [initialToCurrency, setInitialToCurrency] = useState<string>("");
  const [initialAmount, setInitialAmount] = useState<number>(1);
  const [graphDays, setGraphDays] = useState<string[]>([]);
  const [graphValues, setGraphValues] = useState<number[]>([]);
  const [timeFrame, setTimeFrame] = useState<number>(30);

  const [chartData, setChartData] = useState<Chart | any>();
  const [chartConfig, setChartConfig] = useState<Chart | any>();

  const [isgraphData, setIsGraphData] = useState<boolean>(false);
  const [isGraphBuilt, setIsGraphBuilt] = useState<boolean>(false);
  const [isConversionDone, setIsConversionDone] = useState<boolean>(false);
  const [isTimeFrameUpdated, setIsTimeFrameUpdated] = useState<boolean>(false);
  const [cryptoEnabled, setCryptoEnabled] = useState<boolean>(false);

  const debouncedInput = debounce((value: number) => {
    setAmount(value);
  }, 300);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    debouncedInput(value);
  }

  async function handleConvertValue(): Promise<void> {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }

    if (!cryptoEnabled) {
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
    if (cryptoEnabled) {
      try {
        const response = await axios.post(
          "http://localhost:3000/convertCrypto",
          {
            amount: amount,
            base: fromCurrency,
            symbols: toCurrency,
          }
        );
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
  }
  const debouncedConvertValue = debounce(handleConvertValue);

  useEffect(() => {
    debouncedConvertValue();
  }, [amount, fromCurrency, toCurrency]);

  async function handleGraphData(): Promise<void> {
    if (timeFrame > 365) {
      if (!cryptoEnabled) {
        try {
          const response = await axios.post(
            "http://localhost:3000/buildBiggerGraph",
            {
              amount: amount,
              base: fromCurrency,
              symbols: toCurrency,
              timeFrame: timeFrame,
            }
          );
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
    } else {
      if (!cryptoEnabled) {
        try {
          const response = await axios.post(
            "http://localhost:3000/buildGraph",
            {
              amount: amount,
              base: fromCurrency,
              symbols: toCurrency,
              timeFrame: timeFrame,
            }
          );
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
  }
  const debouncedGraphData = debounce(handleGraphData);
  useEffect(() => {
    if (isConversionDone && !cryptoEnabled) {
      debouncedGraphData();
    }
  }, [isConversionDone, amount, fromCurrency, toCurrency, timeFrame]);

  async function handleCryptoGraphData(): Promise<void> {
    if (cryptoEnabled) {
      try {
        const response = await axios.post(
          "http://localhost:3000/buildCryptoGraph",
          {
            amount: amount,
            base: fromCurrency,
            symbols: toCurrency,
            timeFrame: timeFrame,
          }
        );
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
  const debouncedCryptoGraphData = debounce(handleCryptoGraphData);
  useEffect(() => {
    if (isConversionDone && cryptoEnabled) {
      debouncedCryptoGraphData();
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
          tension: 0.1,
          borderWidth: 0.5,
          pointStyle: false,
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
  const debouncedGraphBuilding = debounce(handleGraphBuilding);
  useEffect(() => {
    if (isgraphData) {
      debouncedGraphBuilding();
    }
  }, [graphDays, graphValues, isgraphData]);

  async function handleUpdateTimeFrame(newTimeFrame: number) {
    setTimeFrame(newTimeFrame);
    setIsTimeFrameUpdated(true);
  }

  async function handleUpdateTimeButtonClick(
    newTimeFrame: number
  ): Promise<void> {
    await handleUpdateTimeFrame(newTimeFrame);
  }

  async function handleCryptoOnOffEffect() {
    setAmount(0);
    setFromCurrency("");
    setToCurrency("");
    setConvertedAmount(-pi);
    setInitialFromCurrency("");
    setInitialToCurrency("");
    setInitialAmount(0);
    setGraphDays([]);
    setGraphValues([]);
    setTimeFrame(30);
    setChartData(null);
    setChartConfig(null);
    setIsConversionDone(false);
    setIsGraphData(false);
    setIsGraphBuilt(false);
    setIsTimeFrameUpdated(false);
  }

  function debounce(
    cb: Promise<void> | any,
    delay: number = 300
  ): (...args: any) => void {
    let timeout: NodeJS.Timeout;

    return (...args: any) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  return (
    <main
      className="flex justify-center items-center h-[100vh] w-full"
      style={
        cryptoEnabled
          ? {
              backgroundImage: `url(${cryptoBackgroundImage})`,
              backgroundSize: "cover",
            }
          : {
              backgroundImage: `url(${greyBackgroundImage})`,
              backgroundSize: "cover",
            }
      }
    >
      <section
        className={
          cryptoEnabled
            ? "w-full md:max-w-[600px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-20 h-full lg:h-[880px] bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-slate-200"
            : "w-full md:max-w-[600px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-20 h-full lg:h-[880px] bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-slate-200"
        }
      >
        <div>
          <OnOffCrypto
            onClick={handleCryptoOnOffEffect}
            cryptoEnabled={cryptoEnabled}
            setCryptoEnabled={setCryptoEnabled}
          />
        </div>

        {!cryptoEnabled && (
          <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        )}

        {cryptoEnabled && (
          <h1 className="text-xs font-black text-amber-400">Crypto Mode On</h1>
        )}

        {cryptoEnabled && (
          <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        )}

        <span className="text-2xl font-black">Converting Calculator</span>
        {!cryptoEnabled && <img src={tiny} alt="I Only Grow" width={300} />}
        {cryptoEnabled && <img src={tiny2} alt="I Only Grow 2" width={250} />}

        <p className="text-sm mt-1">
          Choose value and currencies for conversion:
        </p>

        <div className="flex flex-row items-center">
          {!cryptoEnabled && (
            <div className="mr-4">
              <p className="text-sm mt-2">From Currency:</p>
              <CurrenciesList
                selectedCurrency={fromCurrency}
                setSelectedCurrency={setFromCurrency}
              />
            </div>
          )}
          {cryptoEnabled && (
            <div className="mr-4">
              <p className="text-sm mt-2">From Currency:</p>
              <CryptoList
                selectedCurrency={fromCurrency}
                setSelectedCurrency={setFromCurrency}
              />
            </div>
          )}

          {!cryptoEnabled && (
            <div className="mr-4">
              <p className="text-sm mt-2">To Currency:</p>
              <CurrenciesList
                selectedCurrency={toCurrency}
                setSelectedCurrency={setToCurrency}
              />
            </div>
          )}
          {cryptoEnabled && (
            <div className="mr-4">
              <p className="text-sm mt-2">To Currency:</p>
              <CryptoList
                selectedCurrency={toCurrency}
                setSelectedCurrency={setToCurrency}
              />
            </div>
          )}

          <div className="mr-4 mt-2">
            <p className="text-sm mt-2">Amount:</p>
            {!cryptoEnabled && (
              <input
                type="number"
                placeholder="1"
                onChange={handleInputChange}
                className="relative mb-2 w-28 h-10 cursor-default rounded-lg
              bg-stone-600 py-3 pl-4 pr-2 text-right shadow-md focus:outline-none
               focus-visible:border-black focus-visible:ring-2
                focus-visible:ring-white focus-visible:ring-opacity-75 
                focus-visible:ring-offset-2 focus-visible:ring-offset-black
                sm:text-sm"
              />
            )}
            {cryptoEnabled && (
              <input
                type="number"
                placeholder="1"
                onChange={handleInputChange}
                className="relative mb-2 w-28 h-10 cursor-default rounded-lg
              bg-stone-600 py-3 pl-4 pr-2 text-right shadow-md focus:outline-none
               focus-visible:border-black focus-visible:ring-2
                focus-visible:ring-white focus-visible:ring-opacity-75 
                focus-visible:ring-offset-2 focus-visible:ring-offset-black
                sm:text-sm"
              />
            )}
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
          justify-center md:px-10 lg:p-2 h-500 lg:h-[500px] bg-white bg-opacity-40 
          backdrop-blur-lg drop-shadow-lg rounded text-zinc-700 mt-4"
          >
            <div>
              <Line
                height={240}
                width={450}
                data={chartData}
                options={chartConfig}
              />
            </div>
            {!cryptoEnabled && (
              <GraphButton
                onClick={() => handleUpdateTimeButtonClick(365 * 24)}
                text="24Y"
              />
            )}
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365 * 20)}
              text="20Y"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365 * 10)}
              text="10Y"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365 * 5)}
              text="5Y"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365 * 3)}
              text="3Y"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(365)}
              text="1Y"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(180)}
              text="6M"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(90)}
              text="3M"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(30)}
              text="1M"
            />
            <GraphButton
              onClick={() => handleUpdateTimeButtonClick(15)}
              text="15D"
            />
          </section>
        )}
      </section>
    </main>
  );
}

export default Search;
