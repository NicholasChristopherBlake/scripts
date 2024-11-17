const fs = require("fs");
const { applyBorders, formatLinkColumns } = require("./excelUtils");

// Makes sure folder exists, if not - create it
function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

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

// Function to wait for an Excel file to become available (2 seconds by default)
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

// Function to wait for file to be available and save it
async function saveExcelFile(workbook, filePath) {
  await waitForFile(filePath);
  await workbook.xlsx.writeFile(filePath);
  // console.log(`Excel file saved to ${filePath}`);
}

// Function to clean up and save
async function cleanupAndSave(
  excelWorkbook,
  excelWorksheet,
  outputFilePath,
  maxLinks = 1
) {
  if (excelWorksheet) {
    // formatLinkColumns(excelWorksheet, maxLinks); // disabled for now
    applyBorders(excelWorksheet);
    // Save the Excel file finally
    await saveExcelFile(excelWorkbook, outputFilePath);
    console.log(
      "Query finished. File has been successfully saved during cleanup"
    );
  }
}

module.exports = { ensureFolderExists, saveExcelFile, cleanupAndSave };

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