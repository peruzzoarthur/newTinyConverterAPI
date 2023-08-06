import { useState } from "react";

import axios from "axios";
import { pi } from "./pi";
import CurrenciesList from "./CurrenciesList";

type SearchProps = {
  convertValue: (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) => Promise<void>;
};

function Search({}: SearchProps) {
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
      setConversionDone(true);
      setInitialFromCurrency(fromCurrency);
      setInitialToCurrency(toCurrency);
      setInitialAmount(amount);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }

  const handleConvertButtonClick = () => {
    handleConvertValue();
    setConversionDone(false);
  };

  return (
    <div>
      <h2 className="text-cyan-600">Conversion calculator</h2>
      <p> Choose value and currencies to convert:</p>
      <div>
        <input
          type="number"
          placeholder="1"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <CurrenciesList
          selectedCurrency={fromCurrency}
          setSelectedCurrency={setFromCurrency}
        ></CurrenciesList>
        <CurrenciesList
          selectedCurrency={toCurrency}
          setSelectedCurrency={setToCurrency}
        ></CurrenciesList>
        <button onClick={handleConvertButtonClick}>💸💸💸</button>
      </div>
      {convertedAmount !== -pi && <h2>Converted Amount: {convertedAmount}</h2>}
      {conversionDone && (
        <h2>
          Converted from {initialFromCurrency} to {initialToCurrency} at a
          conversion rate of: {initialAmount / convertedAmount} for 1.
        </h2>
      )}
    </div>
  );
}

export default Search;
