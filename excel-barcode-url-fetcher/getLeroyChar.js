const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs"); // Import exceljs

// Define the output folder and file name
const folderPath = path.join(__dirname, "leroy_data");
// Create the 'leroy_data' folder if it does not exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Load the Excel file
const filePath = path.join(__dirname, "leroy_data", "data_no_description.xlsx");
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Create a new Excel workbook and worksheet
const excelWorkbook = new ExcelJS.Workbook();
const excelWorksheet = excelWorkbook.addWorksheet("With Leroy Char");

const outputFilePath = path.join(folderPath, "leroy_data_with_char2.xlsx");
// For correctly applying link columns
let maxLinks = 0;

// Get item numbers from the first column, starting from the second row
const itemCodes = XLSX.utils
  .sheet_to_json(sheet, { header: 1 })
  .slice(1)
  .map((row) => (row[0] ? row[0].toString().trim() : "")); // empty or undefined

console.log(itemCodes);

// Function to check if a file is locked (EBUSY)
function isFileInUse(filePath) {
  try {
    // Try to open the file with read and write permissions
    fs.openSync(filePath, "r+");
    return false;
  } catch (err) {
    if (err.code === "EBUSY" || err.code === "EACCES") {
      return true;
    }
    throw err;
  }
}

// Function to wait for a file to become available (2 seconds by default)
async function waitForFile(filePath, retryInterval = 2000) {
  return new Promise((resolve) => {
    const checkFile = () => {
      if (!isFileInUse(filePath)) {
        resolve();
      } else {
        console.log(
          `File is in use. Please close the file. Retrying in ${
            retryInterval / 1000
          } seconds...`
        );
        setTimeout(checkFile, retryInterval);
      }
    };
    checkFile();
  });
}

// Function for retrying in case of failing fetching
async function navigateWithRetry(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
      return; // Success
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error);
      if (i === retries - 1) throw error; // Re-throw error on last attempt
    }
  }
}

async function saveExcelFile(excelWorkbook, outputFilePath) {
  await waitForFile(outputFilePath);
  await excelWorkbook.xlsx.writeFile(outputFilePath);
  console.log(`Excel file saved to ${outputFilePath}`);
}

// Function to apply borders to all cells
function applyBorders(worksheet) {
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });
}

// Function to format link columns
function formatLinkColumns(excelWorksheet, maxLinks) {
  for (let i = 1; i <= maxLinks; i++) {
    const columnIndex = i + 2; // Link columns start from index 2 (0-based index)
    excelWorksheet.getColumn(columnIndex).header = `Link ${i}`; // Set dynamic header
    excelWorksheet.getColumn(columnIndex).alignment = {
      wrapText: true,
      vertical: "top",
      horizontal: "left",
    };
    excelWorksheet.getColumn(columnIndex).width = 10; // Adjust width as needed
  }
}

// Function to clean up and save
async function cleanupAndSave(
  excelWorkbook,
  excelWorksheet,
  outputFilePath,
  maxLinks
) {
  if (excelWorksheet) {
    formatLinkColumns(excelWorksheet, maxLinks);
    applyBorders(excelWorksheet);
    // Save the Excel file finally
    await saveExcelFile(excelWorkbook, outputFilePath);
    console.log(
      "Query finished. File has been successfully saved during cleanup"
    );
  }
}

// let isCleaningUp = false; // Flag to avoid double cleanup

// // Signal handler for cleanup on Ctrl+C
// process.on("SIGINT", async () => {
//   if (isCleaningUp) return; // If cleanup is already in progress, skip
//   isCleaningUp = true;
//   console.log("Caught interrupt signal (Ctrl+C). Cleaning up...");
//   try {
//     console.log("Cleanup started.");
//     await cleanupAndSave(
//       excelWorkbook,
//       excelWorksheet,
//       outputFilePath,
//       maxLinks
//     );
//     console.log("Cleanup completed.");
//   } catch (error) {
//     console.error("Error during cleanup:", error);
//   } finally {
//     isCleaningUp = false;
//     process.exit(0); // Only exit after everything is done
//   }
// });

// Function to generate a random delay between 3-10 seconds
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay() {
  return Math.random() * (6000 - 3000) + 3000; // Random delay between 3000 ms (3 seconds) and 10000 ms (10 seconds)
}

// Function to get a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getImageUrl(page, itemCode) {
  if (!itemCode) {
    return null;
  }

  // Capture browser console messages
  // TURN ON FOR CONSOLE LOGGING BROWSER LOGS
  // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
    );
    await navigateWithRetry(
      page,
      `https://leroymerlin.kz/search/?q=${itemCode}`
    );

    // Wait for necessary elements to load
    try {
      await page.waitForSelector("div.product-gallery__stage.jcarousel");
      await page.waitForSelector("div.about__params");
      await page.waitForSelector("a.js-control-params-table"); // full characteristics
      await page.click("a.js-control-params-table");
      // await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
    } catch (e) {
      console.error(
        "Product gallery not found, falling back to alternative selector..."
      );
    }

    const info = await page.evaluate(() => {
      let description = "";

      const descriptionDiv = document.querySelector(
        "table.about__params__table"
      );
      if (descriptionDiv) {
        description = descriptionDiv.innerText;
      } else {
        console.error("Element description not found");
      }

      const galleryDiv = document.querySelector(
        "div.product-gallery__stage.jcarousel"
      );
      const images = galleryDiv ? galleryDiv.querySelectorAll("img") : [];
      const imgLinks =
        images.length > 0 ? Array.from(images).map((img) => img.src) : [];

      return [description, imgLinks];
    });

    // console.log(info);

    return {
      description: info[0],
      imgLinks: info[1],
    };
  } catch (e) {
    console.error(
      `Error processing item code ${itemCode} on page navigation or evaluation`,
      e
    );
    return { description: null, imgLinks: null };
  }
}

async function processItemCodes(itemCodes) {
  // Set headless - true if you don't want to see what happens in the browser
  const browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage(); // Start with a single page

  const leroyInfo = [];
  let queryCount = 0; // To keep track of the number of queries

  // Start total timer
  const totalStartTime = Date.now();

  // Add static headers
  let excelColumns = [
    {
      header: "Item Code",
      key: "item_code",
      width: 10,
      style: {
        alignment: { vertical: "top", horizontal: "left" },
      },
    },
    {
      header: "Description",
      key: "description",
      width: 160,
      style: {
        alignment: { wrapText: true, vertical: "top", horizontal: "left" },
      },
    },
  ];

  // Set columns to the worksheet
  excelWorksheet.columns = excelColumns;

  for (const itemCode of itemCodes) {
    // Get info for one item code
    if (!itemCode) {
      leroyInfo.push([itemCode, "No item code"]);
      continue;
    }

    // Start query timer
    const queryStartTime = Date.now();

    try {
      // Get Leroy info
      const { description, imgLinks } = await getImageUrl(page, itemCode);
      leroyInfo.push([
        itemCode,
        description || "No text",
        imgLinks || "No Link",
      ]);
      console.log(
        `Item Code: ${itemCode}, Description: ${description
          ?.toString()
          ?.substring(0, 10)}, Image Links: ${imgLinks?.length}`
      );

      // Add the data to Excel after each call
      const rowData = [itemCode, description];
      // Add each link from the imgLinks array to the rowData
      if (imgLinks) {
        // Count the maximum number of links
        if (imgLinks.length > maxLinks) {
          maxLinks = imgLinks.length;
        }
        for (let i = 0; i < imgLinks.length; i++) {
          rowData.push(imgLinks[i] || ""); // Add the link or an empty string if no link
        }
        const row = excelWorksheet.addRow(rowData);
        row.height = 450;
      }
      // Save the Excel file after each iteration
      await saveExcelFile(excelWorkbook, outputFilePath);
    } catch (e) {
      console.error(`Error processing item code ${itemCode}:`, e);
      leroyInfo.push([itemCode, "Error", "Error"]);
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

    // Open a new tab and close the old one every random number of queries
    if (queryCount >= getRandomInt(10, 20)) {
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

  await cleanupAndSave(excelWorkbook, excelWorksheet, outputFilePath, maxLinks);

  // IMPORTANT! Close browser at the end
  await page.close();
  await browser.close();
}

processItemCodes(itemCodes).catch(console.error);
