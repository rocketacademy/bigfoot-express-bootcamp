import e from "express";
import express, { response } from "express";

import { readFile } from "fs";

const app = express();

//http://localhost:3004/sightings/0

app.get("/sightings/:index", (req, res) => {
  console.log("[/sightings/:index] Request received.");

  const { params, query } = req; // params (path) / (params) query
  const { index } = params;
  readFile("data.json", (err, content) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const json = JSON.parse(content);
    const { sightings } = json;
    const sighting = sightings[index];

    console.log(sighting);

    const divs = [];
    for (const pairs of Object.entries(sighting)) {
      const [key, value] = pairs;
      const div = `<div>${key} : ${value} </div>`;
      divs.push(div);
    }

    const contentHtml = `
    <html>
      <body>
        <h1>${divs.join("")}</h1>
      </body>
    </html>
  `;
    console.log(res);
    res._construct;

    res.send(contentHtml);

    return;
  });
});

app.get("/apple", (req, res) => {
  res.send("[/apple] route A");
});

app.get("/apple", (req, res) => {
  res.send("[/apple] route B");
});

//http://localhost:3004/year-sightings/1989

const compare = (a, b) => {
  if (a < b) {
    return -1;
  } else if (b < a) {
    return 1;
  } else {
    return 0;
  }
};
app.get("/year-sightings/:year", (req, res) => {
  console.log("[/year-sightings/:year] Request received.");

  const { params, query } = req; // params (path) / (params) query
  const { year } = params;

  const { ascending } = query;

  const isSortAscending = ascending === "true";
  readFile("data.json", (err, content) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const SIGHT_KEY_YEAR = "YEAR";
    const json = JSON.parse(content);
    const { sightings } = json;
    const sightingInYears = sightings
      .filter((sighting) => {
        // sighting selection
        return sighting[SIGHT_KEY_YEAR] === year;
      })
      .map((sighting) => {
        // prop selection
        return {
          [SIGHT_KEY_YEAR]: sighting[SIGHT_KEY_YEAR],
          STATE: sighting["STATE"],
        };
      });

    sightingInYears.sort((sightingA, sightingB) => {
      if (sightingA["STATE"] === sightingB["STATE"]) {
        return 0;
      } else if (isSortAscending) {
        return compare(sightingA["STATE"], sightingB["STATE"]);
      } else {
        return -1 * compare(sightingA["STATE"], sightingB["STATE"]);
      }
    });
    sightingInYears.forEach((s) => console.log(s["STATE"]));

    const sightingInYearDivs = sightingInYears.map((sighting) => {
      // transform div
      console.log(sighting["STATE"]);
      return `<div>YEAR: ${sighting[SIGHT_KEY_YEAR]}</div><div>STATE: ${sighting["STATE"]}</div>`;
    });

    const contentHtml = `
    <html>
      <body>
      <div>isSortAscending ${isSortAscending}</div>
        <h1>${sightingInYearDivs.join("")}</h1>
      </body>
    </html>
  `;

    res.send(contentHtml);

    return;
  });
});

app.listen(3004);

console.log("Listening");

/**
 * What happens if the server does not send a response? What does that look like in the Chrome Network tab?
 *
 * no payload (req and res)
 * loading tab
 * no response status
 */

/**
 * What happens if we send 2 responses from the same request handler, e.g. 2 calls to response.send?
 * second Response.send throws ERR_HTTP_HEADERS_SENT
 */

/**
 * What are other attributes in the Express request and response objects? console.log them to see.
 * object
 * Req methods:
 *  on off once
 * Res methods:
 *
    append assignSocket attachment
 * 
 */
