const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

function formatURL(prefix, url) {
  if (!prefix || !url) return null;

  if (prefix.endsWith("/") && url.startsWith("/")) {
    return prefix + url.substring(1, url.length);
  } else return prefix + url;
}

app.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (typeof url !== "string") return res.sendStatus(400);

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").text();
    let logo = $('link[rel="icon"]').attr("href");
    logo = logo
      ? logo.startsWith("http")
        ? logo
        : formatURL(url, logo)
      : null;

    return res.status(200).json({ status: true, data: { title, logo } });
  } catch (e) {
    console.error(e);

    return res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
