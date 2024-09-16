const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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

// // Function to decode base64 to actual image for saving
// function base64ToImage(base64Data, filePath) {
//   const base64Image = base64Data.split(";base64,").pop();
//   fs.writeFile(filePath, base64Image, { encoding: "base64" }, (err) => {
//     if (err) {
//       console.error("Error writing file:", err);
//     } else {
//       console.log("Image saved successfully to", filePath);
//     }
//   });
// }

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
    if (elementHandle) {
      await elementHandle.hover();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for hover effect to apply
    }

    const href = await page.evaluate((element) => {
      return element ? element.href : null;
    }, elementHandle);

    const decodedUrl = decodeUrlParams(href);
    if (decodedUrl) {
      return decodeURIComponent(decodedUrl);
    }

    // // Wait for images to load and find the first valid image
    // const imageBase64Code = await page.evaluate(() => {
    //   const images = Array.from(document.querySelectorAll("img"));

    //   // Find the first image that is not a placeholder or logo
    //   for (const img of images) {
    //     const src = img.src;
    //     if (
    //       src &&
    //       !src.includes("tia.png") &&
    //       !src.includes("googleg") &&
    //       !src.includes("svg")
    //     ) {
    //       // You might add more conditions to filter out unwanted URLs
    //       if (img.naturalWidth > 100 && img.naturalHeight > 100) {
    //         // Ensure the image has reasonable dimensions
    //         return src;
    //       }
    //     }
    //   }

    return null;
  } catch (e) {
    console.error(`Error processing barcode ${barcode}:`, e);
    return null;
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
      const imageUrl = await getFirstImageUrl(page, barcode);
      updatedBarcodes.push([barcode, imageUrl || "No Image"]);
      console.log(`Barcode: ${barcode}, Image URL: ${imageUrl}`);
    } catch (e) {
      console.error(`Error processing barcode ${barcode}:`, error);
      updatedBarcodes.push([barcode, "Error"]);
    } finally {
      // End query timer
      const queryEndTime = Date.now();
      const queryDuration = ((queryEndTime - queryStartTime) / 1000).toFixed(1); // Seconds with 1 decimal
      console.log(`Query took: ${queryDuration} seconds`);
    }

    // console.dir(imageUrl, { depth: null });
    // console.log(JSON.stringify(imageUrl, null, 2));
    // base64ToImage(imageUrl, `images/${barcode}image.jpg`);

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

  // Write updated data to a new sheet
  const newSheet = XLSX.utils.aoa_to_sheet(updatedBarcodes);
  XLSX.utils.book_append_sheet(workbook, newSheet, "With Images");

  // Define the folder and file name
  const folderPath = path.join(__dirname, "data");
  const fileName = "data_with_images.xlsx";
  const filePath = path.join(folderPath, fileName);

  // Create the 'data' folder if it does not exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Save the workbook to the specified path
  XLSX.writeFile(workbook, filePath);
  console.log(`Added new sheet to ${filePath}`);

  // IMPORTANT! Close browser at the end
  await page.close();
  await browser.close();
}

processBarcodes(barcodes).catch(console.error);
