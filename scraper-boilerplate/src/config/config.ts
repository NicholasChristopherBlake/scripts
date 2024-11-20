import path from "path";

const dataFolderPath = path.join(__dirname, "..", "data");
const inputFilePath = path.join(__dirname, "..", "data", "input.xlsx");
const inputSheetName = "New Data";
const outputFilePath = path.join(__dirname, "..", "data", "output.xlsx");
const outputFileName = "results";

export {
  dataFolderPath,
  inputFilePath,
  inputSheetName,
  outputFilePath,
  outputFileName,
};
