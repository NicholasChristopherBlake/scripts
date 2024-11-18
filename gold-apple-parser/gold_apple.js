const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const { categories, folderPath, linksFilePath, infoFilePath } = require("./util/config");
const { waitForDelay } = require('./util/browserUtils')
const { ensureFolderExists, saveExcelFile } = require("./util/fileUtils");

async function fetchAndParseProductInfo(product_url, retries = 3, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(product_url);
  
      const $ = cheerio.load(response.data); // Loads the HTML into cheerio for parsing
      
      let subcategory = $('div.-lCwe').text() || '';
      subcategory = subcategory.replace(/\s+/g, ' ').trim();
      let name = $('h1.b8mg8').text() || '';
      name = name.replace(/\s+/g, ' ').trim();
      let price = $('div[itemprop="offers"]').children().first().text() || '';
      price = price.replace(/\s+/g, ' ').trim();
  
      // Loop through each <picture> element
      const photo_links = [];
  
      $('picture.ga-image-responsive').each((index, pictureElement) => {
          // For each <picture>, find all the <source> elements inside it
          $(pictureElement).find('img').each((imgIndex, imgElement) => {
            const src = $(imgElement).attr('src');
            photo_links.push(src);
        });
      });
  
      let article = $('div[text="описание"] div.Zfnvl').text() || '';
      article = article.replace(/\s+/g, ' ').trim();
      const description = $('div[itemprop="description"]').text() || '';
      let brand = $('div[text="о бренде"] div.eqBV8').text() || '';
      brand = brand.replace(/\s+/g, ' ').trim();
  
      let volume = $('div.apH9h').text() || '';
      volume = volume.replace(/\s+/g, ' ').trim();
  
      const hasVolumeVariants = $('div[role="radio-group"]').length > 0;
      const shade = $('div.eXXzH').text() || '';
      const hasShadeVariants = $('.ga-select__box-content').length > 0;
  
      // console.log (subcategory, name, price, photo_links, article, description, brand, volume, hasVolumeVariants, shade, hasShadeVariants);
      return { subcategory, name, price, photo_links, article, description, brand, volume, hasVolumeVariants, shade, hasShadeVariants };
    } catch (error) {
      if (i === retries - 1) {
        console.error(`Error fetching or parsing HTML ${product_url}`, error);
        return {}; // when there's an error
      } // No retries left
      console.log(`Retrying... (${i + 1}/${retries})`)
      await new Promise((resolve) => setTimeout(resolve, delay)); // Delay before retry
    }
  }
}

async function fetchAndParseAllCategoryProducts(category, min = 'all', max = 'all') {
  console.log(`Starting to fetch category ${category.description}`);
  ensureFolderExists(folderPath);

  // Load links
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(linksFilePath);
  const worksheet = workbook.getWorksheet(category.description);

  if (!worksheet) {
    console.error(`Category sheet "${category.description}" not found.`);
    return;
  }

  // Create a new workbook to store results
  const resultWorkbook = new ExcelJS.Workbook();
  const resultWorksheet = resultWorkbook.addWorksheet(category.description);

  resultWorksheet.columns = [
    { header: "Ссылка на продукт", key: "link", width: 10},
    { header: "Подкатегория", key: "subcategory", width: 30 },
    { header: "Название", key: "name", width: 30 },
    { header: "Цена, тг", key: "price", width: 10 },
    { header: "Ссылки на фото", key: "photo_links", width: 50 },
    { header: "Артикул", key: "article", width: 15 },
    { header: "Описание", key: "description", width: 50 },
    { header: "Бренд", key: "brand", width: 15 },
    { header: "Объем", key: "volume", width: 10 },
    { header: "Есть варианты объема", key: "volume_variants", width: 10 },
    { header: "Оттенок", key: "shade", width: 10 },
    { header: "Есть варианты оттенка", key: "shade_variants", width: 10 },
  ];

  const allLinks = [];
  // Loop through the rows and parse the links starting from the second row
  worksheet.eachRow(async (row, rowIndex) => {
    if (rowIndex > 1) {  // Skip the first row (headers)
      const link = row.getCell(1).text;  // Get link from the first column
      if (link) {
        allLinks.push(link);
      }
    }
  });

  // Логика с промежутком ссылок
  let startingIndex = 1;
  let endingIndex = allLinks.length;
  if (min !== 'all' && typeof min !== 'number') {
    throw new Error('Вы ввели неправильные данные, первый индекс должен быть числом');
  }
  if (max !== 'all' && typeof max !== 'number') {
    throw new Error('Вы ввели неправильные данные, второй индекс должен быть числом');
  }
  if (min < 0 || max < 0) {
    throw new Error('Вы ввели неправильные данные, индексы не могут быть отрицательными');
  }
  if (max < min) {
    throw new Error('Вы ввели неправильные данные, первый индекс должен быть меньше, чем второй');
  }
  if (min !== 'all') {
    startingIndex = min;
  }
  if (max !== 'all') {
    endingIndex = max;
  }
  if (min === 0) {
    startingIndex = 1;
  }
  if (max > allLinks.length) {
    endingIndex = allLinks.length;
  }

  console.log(`В категории ${category.description} всего ${allLinks.length} ссылок`);
  console.log(`Поиск ведется с ${startingIndex} по ${endingIndex} ссылку`);

  for (let index = startingIndex - 1; index < endingIndex; index++) {
    const link = allLinks[index];
    console.log(link);
    const parsedInfo = await fetchAndParseProductInfo(link);
    if (!parsedInfo || Object.keys(parsedInfo).length === 0) {
      console.log(`Skipping ${link} due to errors`);
      resultWorksheet.getCell(`A${index + 2}`).value = link;
      continue;
    }
    const { subcategory, name, price, photo_links, article, description, brand, volume, hasVolumeVariants, shade, hasShadeVariants } = parsedInfo;
    
    // Задержка между запросами
    await waitForDelay(1500);

    resultWorksheet.getCell(`A${index + 2}`).value = link;
    resultWorksheet.getCell(`B${index + 2}`).value = subcategory;
    resultWorksheet.getCell(`C${index + 2}`).value = name;
    resultWorksheet.getCell(`D${index + 2}`).value = price;
    resultWorksheet.getCell(`E${index + 2}`).value = photo_links.join(', ');
    resultWorksheet.getCell(`F${index + 2}`).value = article;
    resultWorksheet.getCell(`G${index + 2}`).value = description;
    resultWorksheet.getCell(`H${index + 2}`).value = brand;
    resultWorksheet.getCell(`I${index + 2}`).value = volume;
    resultWorksheet.getCell(`J${index + 2}`).value = hasVolumeVariants;
    resultWorksheet.getCell(`K${index + 2}`).value = shade;
    resultWorksheet.getCell(`L${index + 2}`).value = hasShadeVariants;

    saveExcelFile(resultWorkbook, infoFilePath);
  }

  console.log(`Поиск по категории ${category.description} завершен`);
}

// Для тестирования по отдельной странице
// fetchAndParseProductInfo('https://goldapple.kz/19000019565-promise-hair-mist');
// fetchAndParseAllCategoryProducts(categories[14]);

fetchAndParseAllCategoryProducts(categories[14], 1, 1000);
