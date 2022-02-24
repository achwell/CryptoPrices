require("dotenv").config();

const {API_KEY, BASE_URL, BASE_URL_V1, CHECK_INTERVALL_MS, DETAIL_URL, LIST_URL, MARKET_DATA_URL, PORT} = process.env;

const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");

const app = express();
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Listining to ${PORT}`);
});

const socketHandler = socketIO(server);

socketHandler.on("connection", (socket) => {
  socket.on("connect_error", () => {
    console.log("Connection error!");
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected!");
  });
  console.log("Client Connected!");
  socket.emit("crypto", "Hello Cryptos Client!");
});

const getPrices = () => {
  axios
    .get(`${BASE_URL}${LIST_URL}`, {headers: {"x-messari-api-key": API_KEY}})
    .then((response) => {
      const priceList = response.data.data.map((item) => {
        return {
          id: item.id,
          name: item.symbol,
          price: item.metrics.market_data.price_usd,
        };
      });

      socketHandler.emit("crypto", priceList);
    })
    .catch((err) => {
      console.log(err);
      socketHandler.emit("crypto", {
        error: true,
        message: "Error Fetching Prices Data From API",
        errorDetails: error
      });
    });
};

setInterval(() => getPrices(), CHECK_INTERVALL_MS);

app.get("/cryptos/profile/", (req, res) => {
    res.json({error: true, message: "Missing crypto ID in the API URL"});
});
app.get("/cryptos/profile/:id", (req, res) => {
    const cryptoID = req.params.id;
    axios
    .get(`${BASE_URL}/${cryptoID}${DETAIL_URL}`, {headers: {"x-messari-api-key": API_KEY}})
    .then((response) => res.json(response.data.data))
    .catch((err) => res.json({error: true, message: "Error Fetching Prices Data From API", errorDetails: err}));
});

app.get("/cryptos/market-data/", (req, res) => {
    res.json({error: true, message: "Missing crypto ID in the API URL"});
});
app.get("/cryptos/market-data/:id", (req, res) => {
    const cryptoID = req.params.id;
    axios
    .get(`${BASE_URL_V1}/${cryptoID}${MARKET_DATA_URL}`, {headers: {"x-messari-api-key": API_KEY}})
    .then((response) => res.json(response.data.data))
    .catch((err) => res.json({error: true, message: "Error Fetching Marked Data From API", errorDetails: err}));
});