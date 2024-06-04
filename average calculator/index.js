const express = require("express");
const axios = require("axios");

const app = express();
let ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3NTEyMTE5LCJpYXQiOjE3MTc1MTE4MTksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI5YWJlNzg2LTk5MGMtNDkxYy05ZjQxLWM5M2M4MjQyYWRkYiIsInN1YiI6InRhbmlzaGExNDM1LmJlMjFAY2hpdGthcmEuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoibXlNYXJ0IiwiY2xpZW50SUQiOiJiOWFiZTc4Ni05OTBjLTQ5MWMtOWY0MS1jOTNjODI0MmFkZGIiLCJjbGllbnRTZWNyZXQiOiJPTEtvcm5xSWRYREJZT3JDIiwib3duZXJOYW1lIjoiVGFuaXNoYSIsIm93bmVyRW1haWwiOiJ0YW5pc2hhMTQzNS5iZTIxQGNoaXRrYXJhLmVkdS5pbiIsInJvbGxObyI6IjIxMTA5OTE0MzUifQ.6hwLG2-qB8qAE1BuOfsyBJXbwgFbMGVlgG_fmPxDMAg";

const windowSize = 10;
const Qualified_IDs = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

let windowPrevState = [];
let windowCurrState = [];

async function updateAccessToken() {
  const re = await axios.post("http://20.244.56.144/test/auth", {
    companyName: "myMart",
    clientID: "b9abe786-990c-491c-9f41-c93c8242addb",
    clientSecret: "OLKornqIdXDBYOrC",
    ownerName: "Tanisha",
    ownerEmail: "tanisha1435.be21@chitkara.edu.in",
    rollNo: "2110991435",
  });
  console.log(re.data.access_token);
  ACCESS_TOKEN = re.data.access_token;
}

async function getNumbers(qualifiedId) {
  try {
    console.log(qualifiedId);
    console.log(Qualified_IDs[qualifiedId]);
    // const response = await axios.get(
    //   process.env.TEST_SERVER + Qualified_IDs[qualifiedId]
    // );
    // const response = await axios.get(
    //   process.env.TEST_SERVER + Qualified_IDs[qualifiedId]
    // );
    await updateAccessToken();
    const response = await axios.get(
      "http://20.244.56.144/test/" + Qualified_IDs[qualifiedId],
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log(response.data);
    if (response.status === 200) {
      return response.data.numbers;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err.message);
  }
}

app.get("/numbers/:qualifiedId", async (req, res) => {
  const qualifiedId = req.params.qualifiedId;
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
  let sum = 0;
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

app.listen(3000, () => {
  console.log("listening");
});
