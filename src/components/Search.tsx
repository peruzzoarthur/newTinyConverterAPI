import { useState } from "react";
import { TERipple } from "tw-elements-react";
import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";
import BuildGraph from "./BuildGraph";

type SearchProps = {
  convertValue: (
    amount: number | undefined,
    fromCurrency: string,
    toCurrency: string
  ) => Promise<void>;
};

function Search({ convertValue }: SearchProps) {
  const [amount, setAmount] = useState<number>();
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState<number>(-pi);
  const [conversionDone, setConversionDone] = useState(false);
  const [initialFromCurrency, setInitialFromCurrency] = useState("");
  const [initialToCurrency, setInitialToCurrency] = useState("");
  const [initialAmount, setInitialAmount] = useState<number>(1);

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
      setConversionDone(false);
      setInitialFromCurrency(fromCurrency);
      setInitialToCurrency(toCurrency);
      setInitialAmount(amount);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  const handleConvertButtonClick = async () => {
    await Promise.all([
      convertValue(amount, fromCurrency, toCurrency),
      handleConvertValue(),
    ]);
    setConversionDone(true);
  };

  return (
    <main className="flex justify-center items-center  h-[100vh] w-full">
      <section
        className="w-full md:max-w-[500px] p-4 flex flex-col text-center 
      items-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px]
       bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg 
       rounded text-zinc-700"
      >
        <h1 className="text-4xl font-thin">The New Tiny Converter</h1>
        <span className="text-2xl font-black">Converting Calculator</span>
        <p className="text-sm mt-1">
          Choose value and currencies for convertion:
        </p>
        <div className="relative flex items-center">
          <div className="relative flex flex-col mt-5 md:mt-4 items-center">
            <div className="relative flex mb ">
              <p className="text-sm pb-14">Amount to convert:</p>
            </div>
            <input
              type="number"
              placeholder="1"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-right absolute mt-6 w-28 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            />{" "}
          </div>
          <div className="relative flex flex-col-reverse mt-2 m-6 md:mt-4 items-center">
            <CurrenciesList
              selectedCurrency={toCurrency}
              setSelectedCurrency={setToCurrency}
            />
            <p className="text-sm mt-2">To currency:</p>

            <CurrenciesList
              selectedCurrency={fromCurrency}
              setSelectedCurrency={setFromCurrency}
            />
            <p className="text-sm mt-2">From currency:</p>
          </div>
          <TERipple>
            <button
              onClick={handleConvertButtonClick}
              type="button"
              className="inline-block rounded border-2 mt-4
                border-primary-100 px-3 pb-[6px] pt-2 text-xs font-medium
                leading-normal text-primary-700 transition
                duration-150 ease-in-out hover:border-primary-accent-100
                hover:bg-neutral-500 hover:bg-opacity-10
                focus:border-primary-accent-100 focus:outline-none focus:ring-0
                active:border-primary-accent-200 dark:text-primary-100
                dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
            >
              {" "}
              💸💸💸
            </button>
          </TERipple>
        </div>
        <section
          className="w-400 full md:max-w-[400px] p-4 flex flex-col text-lg 
        items-center justify-center md:px-10 lg:p-2 h-200 lg:h-[400px]
         bg-white bg-opacity-40 backdrop-blur-lg drop-shadow-lg rounded
          text-zinc-700"
        >
          {convertedAmount !== -pi && (
            <h2 className="font-black">
              Converted Amount: {convertedAmount.toFixed(2)}
            </h2>
          )}
          {conversionDone && (
            <h2 className="font-thin">
              Converted from {initialFromCurrency} to {initialToCurrency} at a
              conversion rate of {(initialAmount / convertedAmount).toFixed(4)}{" "}
              to 1.
            </h2>
          )}
        </section>
        <BuildGraph
          convertValue={convertValue}
          amount={amount}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
      </section>
    </main>
  );
}

export default Search;
