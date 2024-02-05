import express from "express";
import path from "path";
import { engine } from 'express-handlebars';
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();
const DEBUG = process.env.NODE_ENV !== "production";
const MANIFEST: Record<string, any> = DEBUG ? {} : JSON.parse(fs.readFileSync("static/.vite/manifest.json").toString())

const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
});

if (!DEBUG) {
  app.use(express.static('static'));
} else {
  app.use((req, res, next) => {
    if (req.url.includes(".")) {
      res.redirect(`http://${process.env.ASSET_URL}:5173${req.url}`)
    } else {
      next();
    }
  });
}


console.log(MANIFEST);
app.get("/", (req, res) => {
  console.log(req.ip);
  res.render('index', {
    debug: DEBUG,
    jsBundle: DEBUG ? "" : MANIFEST["src/main.jsx"]["file"],
    cssBundle: DEBUG ? "" : MANIFEST["src/main.jsx"]["css"][0],
    layout: false,
    assetURL: process.env.ASSET_URL
  });
});

app.listen(process.env.PORT, () => {
  console.log(`server ip: ${process.env.ASSET_URL}`);
  console.log(`Listening on port ${process.env.PORT}...`);
});


