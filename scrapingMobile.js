import puppeteer from "puppeteer";
import getbrandkoname from "./brandName.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const pagenumber = 1;
const pagestoiterate = 10;
let currentpagenumber = pagenumber - 1;

const url = `https://www.flipkart.com/search?q=mobile+phones&p%5B%5D=facets.fulfilled_by%255B%255D%3DF-Assured&p%5B%5D=facets.brand%255B%255D%3DREDMI&page=${pagenumber}`;

const scrap = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "load" });

  let totalData = [];

  try {
    const numberofdivs = await page.evaluate(() => {
      return document.querySelectorAll(".tUxRFH").length;
    });

    console.log(`There are ${numberofdivs} divs`);

    for (let i = 0; i < pagestoiterate; i++) {
      currentpagenumber++;
      for (let i = 0; i < numberofdivs; i++) {
        console.log(
          `Clicking the div number ${i + 1} of page ${currentpagenumber}`
        );

        const divs = await page.$$(".tUxRFH");

        if (divs[i]) {
          await divs[i].click();
          console.log(`Clicked on div${i + 1}`);

          await new Promise((resolve) => setTimeout(resolve, 10000));

          const pages = await browser.pages(); // Get all open tabs

          let newTab;

          try {
            newTab = pages[pages.length - 1];

            await newTab.waitForSelector(".VU-ZEz", { timeout: 10000 });

            const titleSelector = await newTab.evaluate(() => {
              return document.querySelector(".VU-ZEz")?.innerText;
            });

            const brand = getbrandkoname(titleSelector);

            const price = await newTab.evaluate(() => {
              return document.querySelector(".Nx9bqj.CxhGGd")?.innerText;
            });

            const readmorebtn = await newTab.$(".QqFHMw._4FgsLt");

            await newTab.waitForSelector(".GNDEQ-");
            await newTab.evaluate(() => {
              const element = document.querySelector(".GNDEQ-");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            });

            if (readmorebtn) {
              readmorebtn.click();
              console.log("clicked on readmore button");
              await new Promise((resolve) => setTimeout(resolve, 3000));
            }

            const extracteddatas = await newTab.evaluate(() => {
              let obj = {};
              let displaySize = "";
              let resolution = "";
              let androidVersion = "";
              let InternalStorage = "";
              let ram = "";
              let batteryCapacity = "";
              let networkfeature = "";
              let processorBrand = "";
              let processorCore = "";
              let processorType = "";
              let primarycamera = "";
              let secondarycamera = "";
              const listofdivs = document.querySelectorAll(".GNDEQ-");

              for (let div of listofdivs) {
                const element = div.querySelector("._4BJ2V\\+");
                if (
                  element &&
                  element.textContent.trim() == "Display Features"
                ) {
                  console.log("Display Features div found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Display Size") {
                      displaySize = featurevalues;
                    } else if (featureName === "Resolution") {
                      resolution = featurevalues;
                    }
                  });
                }

                if (
                  element &&
                  element.textContent.trim() == "Os & Processor Features"
                ) {
                  console.log("Os Features found");
                  console.log("Display Features div found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Operating System") {
                      androidVersion = featurevalues;
                    }
                    if (featureName === "Processor Brand") {
                      processorBrand = featurevalues;
                    }
                    if (featureName === "Processor Type") {
                      processorType = featurevalues;
                    }
                    if (featureName === "Processor Core") {
                      processorCore = featurevalues;
                    }
                  });
                }

                if (
                  element &&
                  element.textContent.trim() == "Memory & Storage Features"
                ) {
                  console.log("Memory & Storage Features found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Internal Storage") {
                      InternalStorage = featurevalues;
                    }
                    if (featureName === "RAM") {
                      ram = featurevalues;
                    }
                  });
                }

                if (
                  element &&
                  element.textContent.trim() == "Battery & Power Features"
                ) {
                  console.log("Battery & Power Features found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Battery Capacity") {
                      batteryCapacity = featurevalues;
                    }
                  });
                }

                if (
                  element &&
                  element.textContent.trim() == "Connectivity Features"
                ) {
                  console.log("Battery & Power Features found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Network Type") {
                      networkfeature = featurevalues;
                    }
                  });
                }

                if (
                  element &&
                  element.textContent.trim() == "Camera Features"
                ) {
                  console.log("Battery & Power Features found");
                  const rows = div.querySelectorAll("tr.WJdYP6");

                  rows.forEach((row) => {
                    const featureName = row
                      .querySelector("td.col-3-12")
                      .textContent.trim();
                    const featurevalues = row
                      .querySelector("td.col-9-12 li")
                      .textContent.trim();

                    if (featureName === "Primary Camera") {
                      primarycamera = featurevalues;
                    }
                    if (featureName === "Secondary Camera") {
                      secondarycamera = featurevalues;
                    }
                  });
                }
              }

              obj = {
                displaySize: displaySize,
                resolution: resolution,
                androidVersion: androidVersion,
                Ram: ram,
                internalStorage: InternalStorage,
                battery: batteryCapacity,
                networkconfig: networkfeature,
                processorbrand: processorBrand,
                processorcore: processorCore,
                processorType: processorType,
                primarycamera: primarycamera,
                secondarycamera: secondarycamera,
              };

              return obj;
            });

            console.log(`Brand is ${brand} and price is ${price}`);
            totalData.push({
              brand: brand,
              price: price,
              ...extracteddatas,
            });

            console.log(`Completed for div ${i + 1}`);
            console.log(totalData);

            await newTab.close();
          } catch (error) {
            console.log(`Skipping div no. ${i + 1} error - ${error}`);
            if (newTab) {
              await newTab.close();
            }
            continue;
          }
        }
      }
      console.log(`Try to click on next button`);

      const pages = await browser.pages(); //returns all the pages
      const currentPage = pages[0];
      await currentPage.evaluate(() => {
        const newbutton = document.querySelectorAll("._9QVEpD")[1];

        if (newbutton) {
          newbutton.click();
        }
      });
      console.log("clicked on the next button");
    }
  } catch (error) {
    console.log(`Error encountered : ${error}`);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const folder = path.join(__dirname, "scrapeddata", "redmi");
  const file = path.join(folder, `redmi${pagenumber}-${pagestoiterate}.json`);

  fs.writeFileSync(file, JSON.stringify(totalData, null, 2), "utf-8");

  await browser.close();

  console.log("task terminated");
  console.log("browser closed successfully ");
  return 0;
};

scrap();
