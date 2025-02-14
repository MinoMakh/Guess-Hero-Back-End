const express = require("express");
const cors = require('cors');
const routes = require("./routes/heroRoutes");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
