const express = require("express");
const getInputValueAndName = require("./getInputValueAndName");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/getCalculation", (req, res) => {
  const {numbersProperties} = req.body;
  if(!numbersProperties) {
    return res.status(400).json({error: "The numbersProperties field is required"});
  }
  getInputValueAndName(numbersProperties)
    .then((top5Positions) => {
      res.json(top5Positions);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
