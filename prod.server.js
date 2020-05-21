const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");

const data = require("./public/muck/data");

const { goods, ratings, seller } = data;

const app = express();
const router = express.Router();

router.get("/goods", (req, res) => res.json({ errno: 0, data: goods }));
router.get("/ratings", (req, res) => res.json({ errno: 0, data: ratings }));
router.get("/seller", (req, res) => res.json({ errno: 0, data: seller }));

app.use(history());
app.use(express.static(path.join(__dirname, "./dist")));
app.use("/api", router);

const PORT = process.env.PORT || 9094;

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
