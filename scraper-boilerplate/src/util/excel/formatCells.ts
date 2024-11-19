/**
 * Функция для форматирования ячеек - задания им равнения, высоты и ширины
 */
// function formatCells(worksheet, maxLinks) {
//   for (let i = 1; i <= maxLinks; i++) {
//     const columnIndex = i + 2; // Link columns start from index 2 (0-based index)
//     worksheet.getColumn(columnIndex).header = `Link ${i}`; // Set dynamic header
//     worksheet.getColumn(columnIndex).alignment = {
//       wrapText: true,
//       vertical: "top",
//       horizontal: "left",
//     };
//     worksheet.getColumn(columnIndex).width = 10; // Adjust width as needed
//   }
// }
