import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS header so your browser can access the proxy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy endpoint
app.use("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url parameter");

  try {
    const response = await fetch(target);
    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType || "text/plain");
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
});

// Test root page
app.get("/", (req, res) => {
  res.send("Nova Proxy is running!");
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
