import { useState } from "react";
import axios from "axios";

type BuildGraphProps = {
  convertValue: (
    amount: number | undefined,
    toCurrency: string,
    fromCurrency: string
  ) => Promise<void>;
  amount: number | undefined;
  fromCurrency: string;
  toCurrency: string;
};

function BuildGraph({
  convertValue,
  amount,
  fromCurrency,
  toCurrency,
}: BuildGraphProps) {
  const handleConverValue = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }
    try {
      const data = await convertValue(amount, fromCurrency, toCurrency);
      console.log(data);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };
  return (
    <div className="mx-auto w-3/5 overflow-hidden">
      <canvas
        data-te-chart="line"
        data-te-dataset-label="Timeseries Variation of Converted Value"
        data-te-labels="['Monday', 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday ']"
        data-te-dataset-data="[2112, 2343, 2545, 3423, 2365, 1985, 987]"
      ></canvas>
    </div>
  );
}

export default BuildGraph;
