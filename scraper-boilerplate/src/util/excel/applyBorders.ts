import { Worksheet } from "exceljs";

// TODO функция все еще работает некорректно. Должна делать границы до контента, а делает на всю высоту

/**
 * Функция для применения тонких границ ко всем ячейкам в листе Excel.
 * @param worksheet - Объект Worksheet из библиотеки exceljs, представляющий лист Excel.
 */
export function applyBorders(worksheet: Worksheet): void {
  let maxRow = 0; // Последняя строка с контентом
  let maxCol = 0; // Последний столбец с контентом

  // Определяем максимальную заполненную область (строки и колонки)
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    maxRow = Math.max(maxRow, rowNumber);
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      maxCol = Math.max(maxCol, colNumber);
    });
  });

  if (maxRow === 0 || maxCol === 0) {
    console.log("Лист пуст. Границы не добавлены.");
    return;
  }

  // Применяем границы ко всем ячейкам в пределах найденной области
  for (let rowNumber = 1; rowNumber <= maxRow; rowNumber++) {
    const row = worksheet.getRow(rowNumber);

    for (let colNumber = 1; colNumber <= maxCol; colNumber++) {
      const cell = row.getCell(colNumber);

      // Устанавливаем тонкие границы (thin) вокруг текущей ячейки
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  }
  console.log("Границы добавлены");
}
