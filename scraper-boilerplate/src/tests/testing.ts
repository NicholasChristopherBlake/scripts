import { applyBorders } from "../util/excel/applyBorders";
import { ensureFileExists } from "../util/file/ensureFileExists";
import { readDataFromExcel } from "../util/file/readDataFromExcel";
import { saveDataToExcel } from "../util/file/saveDataToExcel";
import { waitForFile } from "../util/file/waitForFile";
import { randomDelay } from "../util/helpers/delay";
import path from "path";
import ExcelJS from "exceljs";
import { saveExcelFile } from "../util/file/saveExcelFile";

const folderPath = path.join(__dirname, "..", "data");
const fileName = "test_file.xlsx";
const filePath = path.join(folderPath, fileName);
const sheetName = "New Data";

async function testRandomDelay() {
  try {
    console.log("1");
    await randomDelay(5, 10);
    console.log("2");
  } catch (error) {
    console.error(error);
  }
}

async function testWaitForFile() {
  try {
    await waitForFile(filePath, 1000, 5);
  } catch (error) {
    console.error(error);
  }
}

async function testEnsureFileExists() {
  try {
    const fileExists = await ensureFileExists(filePath);
    console.log(fileExists);
  } catch (error) {
    console.error(error);
  }
}

async function testSaveDataToExcel() {
  const data = [
    ["Date", "", "Product", null, {}, "Quantity", "Price"],
    ["2024-11-19", "Laptop", 5, 1200],
    ["2024-11-20", "Phone", 10, 800],
  ];

  try {
    await saveDataToExcel(folderPath, fileName, sheetName, data);
  } catch (error) {
    console.error(error);
  }
}

async function testReadDataFromExcel() {
  try {
    const data = await readDataFromExcel(filePath, sheetName, "A", 1);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

async function testApplyBorders() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(sheetName);
    if (worksheet) {
      applyBorders(worksheet);
      await saveExcelFile(filePath, workbook);
    }
  } catch (error) {
    console.error(error);
  }
}

// testRandomDelay();
// testWaitForFile();
// testEnsureFileExists();
// testSaveDataToExcel();
testReadDataFromExcel();
// testApplyBorders(); // работает некорректно
