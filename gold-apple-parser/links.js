const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const { categories, uhod_subcategories, folderPath, linksFilePath } = require("./util/config");
const { ensureFolderExists, saveExcelFile, cleanupAndSave } = require("./util/fileUtils");

async function parsePage(category, pageNumber) {
  const url = `https://goldapple.kz/${category}?p=${pageNumber}&storestocks=1`;
  console.log(`Fetching page ${pageNumber}: ${url}`);
  
  try {
    // Fetch page HTML
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Array to store links
    const links = [];

    $('a[data-transaction-name="ga-product-card-vertical"]').each((index, linkElement) => {
      const notAvailable = $(linkElement).find('div.Wza2X').filter((_, div) => $(div).text().trim() === 'Нет в наличии').length > 0;
      if (notAvailable) {
        console.log('Нет в наличии');
      } else {
        const link = $(linkElement).attr('href');
        links.push(link);
      }
    });

    return links;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error.message);
    return [];
  }
}

async function parseAllPages(category) {
  const allCategoryLinks = [];
  let pageNumber = 1;

  while (true) {
    const links = await parsePage(category, pageNumber);
    allCategoryLinks.push(...links);

    if (links.length === 0) {
      // Stop if no products are found (end of pagination)
      console.log(`No more products found. Stopping at page ${pageNumber}.`);
      break;
    }

    pageNumber++;
  }

  console.log(`Total products parsed: ${allCategoryLinks.length}`);
  return allCategoryLinks;
}

async function getAllCategoriesLinks(categories) {
  ensureFolderExists(folderPath);
  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  
  for (let category of categories) {
    console.log(`Start fetching for category ${category.description}`);
    // Новый лист для каждой категории
    const worksheet = workbook.addWorksheet(category.description);
    worksheet.columns = [
      { header: "Ссылка на продукт", key: "link", width: 90}
    ]
  
    const categoryLinks = await parseAllPages(category.url);
    categoryLinks.forEach((link, index) => {
      worksheet.getCell(`A${index + 2}`).value = `https://goldapple.kz${link}`;
    })

    await saveExcelFile(workbook, linksFilePath);
  }
}

getAllCategoriesLinks(uhod_subcategories);


