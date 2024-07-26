const express = require("express");
const getInputValueAndName = require("./getInputValueAndName");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
