const express = require("express");
const axios = require("axios");

const app = express();

const windowSize = 10;

let windowPrevState = [];
let windowCurrState = [];

async function getNumbers(qualifiedId) {
  try {
    const response = await axios.get(process.env.TEST_SERVER + qualifiedId, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    console.log(response);
    if (response.status === 200) {
      return response.numbers;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err.message);
  }
}

app.get("/numbers/:qualifiedId", async (req, res) => {
  const qualifiedId = req.params;
  const numbers = await getNumbers(qualifiedId);
  //   console.log(numbers);
  windowPrevState = windowCurrState;

  numbers.forEach((element) => {
    if (!windowCurrState.includes(element)) {
      if (windowCurrState.length >= windowSize) {
        windowCurrState.shift();
      }
      windowCurrState.push(element);
    }
  });
  const sum = 0;
  windowCurrState.forEach((e) => {
    sum += e;
  });

  const avg = sum / windowCurrState.length;

  res.json({
    numbers: numbers,
    windowPrevState: windowPrevState,
    windowCurrState: windowCurrState,
    avg: parseFloat(avg.toFixed(2)),
  });
});

app.listen(3000);
