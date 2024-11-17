const ExcelJS = require('exceljs');

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
};

// Function to format link columns
function formatLinkColumns(worksheet, maxLinks) {
  for (let i = 1; i <= maxLinks; i++) {
    const columnIndex = i + 2; // Link columns start from index 2 (0-based index)
    worksheet.getColumn(columnIndex).header = `Link ${i}`; // Set dynamic header
    worksheet.getColumn(columnIndex).alignment = {
      wrapText: true,
      vertical: "top",
      horizontal: "left",
    };
    worksheet.getColumn(columnIndex).width = 10; // Adjust width as needed
  }
}

async function getLinksFromExcelBySheetName(filePath, sheetName) {
  const workbook = new ExcelJS.Workbook();
  
  try {
    // Load the Excel file
    await workbook.xlsx.readFile(filePath);

    // Get the worksheet by name
    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
      console.error(`Worksheet with name "${sheetName}" not found.`);
      return;
    }

    // Extract links from the first column, starting from the second row
    const links = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip the header row
        const link = row.getCell(1).value || ""; // Get the first column (index is 1-based)
        if (Object.prototype.toString.call(link) === "[object Object]") {
          links.push(link.hyperlink.toString())
        } else if (link) {
          links.push(link.toString()); // Add to the list if not null
        }
      }
    });
    return links;
  } catch (error) {
    console.error('Error reading the Excel file:', error);
  }
}

module.exports = { applyBorders, formatLinkColumns, getLinksFromExcelBySheetName };
