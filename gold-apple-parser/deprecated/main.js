const { categories, folderPath, linksFilePath, infoFilePath } = require("./util/config");
const { ensureFolderExists, saveExcelFile, cleanupAndSave } = require("./util/fileUtils");
const { launchBrowser, getCategoryLinks, getProductInfo } = require("./util/browserUtils");
const { getLinksFromExcelBySheetName } = require('./util/excelUtils');
const ExcelJS = require("exceljs");

async function startQuerying() {
  ensureFolderExists(folderPath);

  const categoryName = categories[4]['url'];
  const categoryDescription = categories[4]['description'];
  const categoryUrlWithPage = `https://goldapple.kz/${categoryName}?p=237&storestocks=1`; // storestocks=1 - есть в наличии
  console.log(categoryName, categoryUrlWithPage);

  // Create output Excel file
  const excelWorkbook = new ExcelJS.Workbook();
  const worksheet = excelWorkbook.addWorksheet(categoryDescription);
  worksheet.columns = [
    { header: "Ссылка на продукт", key: "link", width: 10},
    { header: "Подкатегория", key: "subcategory", width: 30 },
    { header: "Название", key: "name", width: 30 },
    { header: "Цена", key: "price", width: 10 },
    { header: "Ссылки на фото", key: "photo_links", width: 50 },
    { header: "Артикул", key: "article", width: 15 },
    { header: "Описание", key: "description", width: 50 },
    { header: "Бренд", key: "brand", width: 15 },
    { header: "Дополнительная информация (объем, оттенок, количество)", key: "additional_info", width: 50 },
  ];

  // Get list of links from category_links file for this category;
  const category_links = await getLinksFromExcelBySheetName(linksFilePath, categoryDescription);
  const totalNumberOfLinks = category_links.length;
  console.log("Total number of links:", totalNumberOfLinks, ". Links:", category_links[0], category_links[1], category_links[2]);

  // Launch browser
  const browser = await launchBrowser();
  const page = await browser.newPage();

  const product_url = category_links[0];

  try {
    const info = await getProductInfo(page, product_url)
    console.log(info);
    // const url = siteUrl;

    // const hrefs = await getCategoryLinks(page, url);
    // console.log(hrefs);
    // hrefs.forEach((link, index) => {
    //   worksheet.addRow({link});
    // })


  } catch (error) {
    console.error(`Error while scraping`);
  }

  // Save output Excel file
  // await saveExcelFile(excelWorkbook, linksFilePath);

  // Final cleanup and save Excel file
  // await cleanupAndSave(excelWorkbook, worksheet, linksFilePath);

  // IMPORTANT! Close browser at the end
  await page.close();
  await browser.close();
};

startQuerying();