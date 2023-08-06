import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const requestURL = "https://api.exchangerate.host/latest";

app.post("/convert", async (req: Request, res: Response) => {
  try {
    const { amount, base, symbols } = req.body;

    if (!amount || !base || !symbols) {
      res.status(400).json({ message: "Missing required parameters" });
      return;
    }

    const url = `${requestURL}?base=${base}&amount=${amount}&symbols=${symbols}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();

    res.status(200).json({
      fromAmount: Number(amount),
      fromCurrency: base,
      toAmount: data.rates[String(symbols)],
      toCurrency: symbols,
      rate: data.rates[String(symbols)] / Number(amount),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.listen(3000, () => {
  console.log("NODE API RUNNING ON PORT 3000 - http://localhost:3000/convert");
});
