const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs"); // Import exceljs

// Load the Excel file
const filePath = path.join(__dirname, "data", "test_data.xlsx");
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Get barcodes from the first column, starting from the second row
const barcodes = XLSX.utils
  .sheet_to_json(sheet, { header: 1 })
  .slice(1)
  .map((row) => (row[0] ? row[0].toString() : "")); // empty or undefined

console.log(barcodes);

// Get the correct time format for saving files
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Helper function to extract base64 data
function extractBase64Data(base64Data) {
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return matches[2];
  }
  return null;
}

// Function to decode base64 to actual image for saving
function base64ToImage(base64Data, filePath) {
  const base64Image = base64Data.split(";base64,").pop();
  fs.writeFile(filePath, base64Image, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Image saved successfully to", filePath);
    }
  });
}

// Function to generate a random delay between 3-10 seconds
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay() {
  return Math.random() * (5000 - 2000) + 2000; // Random delay between 3000 ms (3 seconds) and 10000 ms (10 seconds)
}

// Function to decode URL parameters
function decodeUrlParams(url) {
  const params = new URLSearchParams(url.split("?")[1]);
  return params.get("imgurl");
}

// Function to get a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getFirstImageUrl(page, barcode) {
  if (!barcode) {
    return null;
  }

  // Capture browser console messages
  // TURN ON FOR CONSOLE LOGGING BROWSER LOGS
  // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
    );
    await page.goto(`https://www.google.com/search?q=${barcode}&udm=2`, {
      waitUntil: "networkidle2", // wait until the load is over
    });

    // Wait for anchors to load
    await page.waitForSelector("h3 a");
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for 2 seconds

    const elementHandle = await page.$("h3 a");
    let link = null; // added

    if (elementHandle) {
      await elementHandle.hover();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for hover effect to apply

      link = await page.evaluate((element) => {
        return element ? element.href : null;
      }, elementHandle);
    }

    const decodedUrl = decodeUrlParams(link);
    if (decodedUrl) {
      link = decodeURIComponent(decodedUrl);
    }

    // Now let's find the first valid base64 image on the page and save it
    const [imageInfo, extractedLink] = await Promise.all([
      page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        for (const img of images) {
          const src = img.src;
          const altText = img.alt;
          if (
            src &&
            src.startsWith("data:image") &&
            !src.includes("tia.png") &&
            !src.includes("googleg") &&
            !src.includes("svg")
          ) {
            // You might add more conditions to filter out unwanted URLs
            if (img.naturalWidth > 100 && img.naturalHeight > 100) {
              // Ensure the image has reasonable dimensions
              return [src, altText]; // Return the base64 source of the image
            }
          }
        }
        return null;
      }),
      Promise.resolve(link),
    ]);

    if (imageInfo[0]) {
      // Generate a file path for saving the image
      const timestamp = getTimestamp();
      const imagePath = path.join(
        __dirname,
        "images",
        `${timestamp}_${barcode}.jpg`
      );

      // Ensure the images folder exists
      const imageFolder = path.join(__dirname, "images");
      if (!fs.existsSync(imageFolder)) {
        fs.mkdirSync(imageFolder);
      }

      // Save the image
      base64ToImage(imageInfo[0], imagePath);
    }

    return {
      imageBase64: imageInfo[0],
      imagePath: imageInfo[0]
        ? path.join(__dirname, "images", `${getTimestamp()}_${barcode}.jpg`)
        : null,
      altText: imageInfo[1],
      link: extractedLink,
    };
  } catch (e) {
    console.error(`Error processing barcode ${barcode}:`, e);
    return { imageBase64: null, imagePath: null, altText: null, link: null };
  }
}

async function processBarcodes(barcodes) {
  // Set headless - true if you don't want to see what happens in the browser
  const browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage(); // Start with a single page

  const updatedBarcodes = [];
  let queryCount = 0; // To keep track of the number of queries

  // Start total timer
  const totalStartTime = Date.now();

  for (const barcode of barcodes) {
    if (!barcode) {
      updatedBarcodes.push([barcode, "No Barcode"]);
      continue;
    }

    // Start query timer
    const queryStartTime = Date.now();

    try {
      // Get image url
      const { imageBase64, imagePath, altText, link } = await getFirstImageUrl(
        page,
        barcode
      );
      updatedBarcodes.push([
        barcode,
        link || "No Image",
        altText || "No Text",
        imageBase64 || "",
      ]);
      console.log(
        `Barcode: ${barcode}, Image URL: ${link}, Alt Text: ${altText}, Image Base64: ${Boolean(
          imageBase64
        )}, Image Path: ${imagePath}`
      );
    } catch (e) {
      console.error(`Error processing barcode ${barcode}:`, error);
      updatedBarcodes.push([barcode, "Error", "Error", "", ""]);
    } finally {
      // End query timer
      const queryEndTime = Date.now();
      const queryDuration = ((queryEndTime - queryStartTime) / 1000).toFixed(1); // Seconds with 1 decimal
      console.log(`Query took: ${queryDuration} seconds`);
    }

    // Add a random delay between requests
    const randomDelay = getRandomDelay();
    console.log(`Waiting for ${(randomDelay / 1000).toFixed(1)} seconds...`);
    await delay(randomDelay);

    queryCount++;

    // Open a new tab and close the old one every random number of queries    if ((i + 1) % 20 === 0 && i !== barcodes.length - 1) {
    if (queryCount >= getRandomInt(3, 6)) {
      queryCount = 0;
      await page.close(); // Close the old tab
      page = await browser.newPage(); // Open a new tab
      console.log("Opening new tab...");
      queryCount = 0; // Reset query counter for the new tab
    }
  }

  // End total timer
  const totalEndTime = Date.now();
  const totalDuration = ((totalEndTime - totalStartTime) / 1000).toFixed(1);
  console.log(`Total time for querying: ${totalDuration} seconds`);

  // Define the folder and file name
  const folderPath = path.join(__dirname, "data");
  // Create the 'data' folder if it does not exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // File with barcodes, links, text and images
  // Create a new Excel workbook and worksheet
  const excelWorkbook = new ExcelJS.Workbook();
  const excelWorksheet = excelWorkbook.addWorksheet("With Images");

  // Add headers
  excelWorksheet.columns = [
    { header: "Barcode", key: "barcode", width: 15 },
    {
      header: "Link",
      key: "link",
      width: 30,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "Alt Text",
      key: "altText",
      width: 40,
      style: { alignment: { wrapText: true } },
    },
    { header: "Image", key: "image", width: 20 },
  ];

  // Add rows and embed images
  for (const [barcode, link, altText, imageBase64] of updatedBarcodes) {
    const row = excelWorksheet.addRow([barcode, link, altText]);
    row.height = 100;

    if (imageBase64) {
      const imageId = excelWorkbook.addImage({
        base64: imageBase64,
        extension: "jpeg",
      });

      // Add the image to the fourth column of the row
      excelWorksheet.addImage(imageId, {
        tl: { col: 3, row: row.number - 1 },
        ext: { width: 100, height: 100 },
      });
    }
  }

  // Save the Excel file
  const outputFilePath = path.join(__dirname, "data", "data_with_images.xlsx");
  await excelWorkbook.xlsx.writeFile(outputFilePath);
  console.log(`New excel data saved to ${outputFilePath}`);

  // IMPORTANT! Close browser at the end
  await page.close();
  await browser.close();
}

processBarcodes(barcodes).catch(console.error);
