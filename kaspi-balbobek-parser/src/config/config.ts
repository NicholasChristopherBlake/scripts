import path from "path";

const dataFolderPath = path.join(__dirname, "..", "data");
const inputFilePath = path.join(__dirname, "..", "data", "products_links.xlsx");
const inputSheetName = "Balbobek";
const outputFilePath = path.join(__dirname, "..", "data", "output.xlsx");
const outputFileName = "results";
const baseUrl = "https://kaspi.kz/shop";
const merchantCode = "&m=11208010";

export {
  dataFolderPath,
  inputFilePath,
  inputSheetName,
  outputFilePath,
  outputFileName,
};
