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

app.post("/convertCrypto", async (req: Request, res: Response) => {
  try {
    const { amount, base, symbols } = req.body;

    if (!amount || !base || !symbols) {
      res.status(400).json({ message: "Missing required parameters" });
      return;
    }

    const url = `${requestURL}?source=crypto&base=${base}&amount=${amount}&symbols=${symbols}`;
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

// _____________________________________________________________________ GRAPHS

const timeSeriesRequestURL = "https://api.exchangerate.host/timeseries";

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function getDateNDaysAgo(n = 30) {
  const now = new Date();
  now.setDate(now.getDate() - n);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

app.post("/buildGraph", async (req, res) => {
  try {
    const { amount, base, symbols, timeFrame } = req.body;
    if (!amount || !base || !symbols) {
      res.status(400).json({ message: "Missing required parameters" });
      return;
    }
    const startDate = getDateNDaysAgo(timeFrame);
    const endDate = getCurrentDate();
    const url = `${timeSeriesRequestURL}?start_date=${startDate}&end_date=${endDate}&base=${base}&amount=${amount}&symbols=${symbols}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    res.status(200).json({
      data: data.rates,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post("/buildCryptoGraph", async (req, res) => {
  try {
    const { amount, base, symbols, timeFrame } = req.body;
    if (!amount || !base || !symbols) {
      res.status(400).json({ message: "Missing required parameters" });
      return;
    }
    const startDate = getDateNDaysAgo(timeFrame);
    const endDate = getCurrentDate();
    const url = `${timeSeriesRequestURL}?source=crypto&start_date=${startDate}&end_date=${endDate}&base=${base}&amount=${amount}&symbols=${symbols}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();

    res.status(200).json({
      data: data.rates,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post("/buildBiggerGraph", async (req, res) => {
  try {
    const { amount, base, symbols, timeFrame } = req.body;
    if (!amount || !base || !symbols) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const howManyRequestsINeed = Math.ceil(timeFrame / 365);
    const aggregatedData = [];

    for (let i = 0; i < howManyRequestsINeed; i++) {
      const segmentStartDate = getDateNDaysAgo((i + 1) * 365);
      const segmentEndDate = getDateNDaysAgo(i * 365);

      const segmentUrl = `${timeSeriesRequestURL}?start_date=${segmentStartDate}&end_date=${segmentEndDate}&base=${base}&amount=${amount}&symbols=${symbols}`;
      const segmentResponse = await fetch(segmentUrl);

      if (!segmentResponse.ok) {
        const message = `An error has occurred: ${segmentResponse.status}`;
        throw new Error(message);
      }

      const segmentData = await segmentResponse.json();
      aggregatedData.unshift(segmentData);
    }

    const mergedRates = aggregatedData.reduce((result, segmentData) => {
      return { ...result, ...segmentData.rates };
    }, {});

    res.status(200).json({
      data: mergedRates,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// app.post("/buildgraphwithtimeframe", async (req, res) => {
//   try {
//     const { amount, base, symbols, timeFrame } = req.body;
//     if (!amount || !base || !symbols || !timeFrame) {
//       res.status(400).json({ message: "Missing required parameters" });
//       return;
//     }

//     let startDate, endDate;

//     if (timeFrame === 5) {
//       startDate = getDateNDaysAgo(5);
//       endDate = getCurrentDate();
//     } else if (timeFrame === 15) {
//       startDate = getDateNDaysAgo(15);
//       endDate = getCurrentDate();
//     } else if (timeFrame === 30) {
//       startDate = getDateNDaysAgo(30);
//       endDate = getCurrentDate();
//     } else if (timeFrame === 90) {
//       startDate = getDateNDaysAgo(90);
//       endDate = getCurrentDate();
//     } else if (timeFrame === 365) {
//       startDate = getDateNDaysAgo(365);
//       endDate = getCurrentDate();
//     } else {
//       res.status(400).json({ message: "Invalid time frame" });
//       return;
//     }

//     const url = `${timeSeriesRequestURL}?start_date=${startDate}&end_date=${endDate}&base=${base}&amount=${amount}&symbols=${symbols}`;
//     const response = await fetch(url);

//     if (!response.ok) {
//       const message = `An error has occurred: ${response.status}`;
//       throw new Error(message);
//     }

//     const data = await response.json();

//     res.status(200).json({
//       data: data.rates,
//     });
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message });
//   }
// });

app.listen(3000, () => {
  console.log("NODE API RUNNING ON PORT 3000 - http://localhost:3000/");
});
