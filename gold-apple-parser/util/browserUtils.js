const puppeteer = require("puppeteer");
const cheerio = require('cheerio');

async function launchBrowser() {
  return puppeteer.launch({ headless: false });
}

// Function for retrying in case of failing fetching
async function navigateWithRetry(page, url, retries = 1) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      return; // Success
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error);
      if (i === retries - 1) throw error; // Re-throw error on last attempt
    }
  }
}

async function getCategoryLinks(page, url) {
  try {
    await navigateWithRetry(page, url);

    // Function to perform smooth scrolling
    const slowScroll = async () => {
      const distance = 100; // distance to scroll per step (in pixels)
      const delay = 10;   // delay between scrolls in milliseconds

      const numberOfElements = 30;
      while (true) {
          // Scroll down a small distance
          await page.evaluate((scrollDistance) => {
            window.scrollBy(0, scrollDistance);
          }, distance);

          // Wait for the page to load new content
          await waitForDelay(delay);

          const hrefs = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('.GHCf5 article a'));
            const hrefs = links.map(link => link.href);
            return hrefs;
          })

          if (hrefs.length >= numberOfElements) {
            break;
          }
      }
    };

    // Scroll slowly and scrape the links
    await slowScroll();

    return await page.evaluate(() => {
      // Extract data from the page
      const links = Array.from(document.querySelectorAll('.GHCf5 article a'));
      const hrefs = links.map(link => link.href);
      return hrefs;
    });
  } catch (error) {
    console.error(`Error getting product links`, error);
    return null;
  }
}

async function getProductInfoCheerio(page, url) {
  try {
    await navigateWithRetry(page, url);
    const delay = 2000;

    // Wait for the page to load new content
    await waitForDelay(delay);

    // Extract the full rendered HTML after JavaScript execution
    const content = await page.content();
    const $ = cheerio.load(content);

    const subcategory = $('div.-lCwe').text().replace(/\s+/g, ' ').trim();
    const name = $('h1.b8mg8').text().replace(/\s+/g, ' ').trim();
    const price = $('div[itemprop="priceSpecification"] meta[itemprop="price"]').attr('content').replace(/\s+/g, ' ').trim()
    + ' ' + $('div[itemprop="priceSpecification"] meta[itemprop="priceCurrency"]').attr('content').replace(/\s+/g, ' ').trim();

    // Loop through each <picture> element
    const photo_links = [];
    console.log($('picture.ga-image-responsive').length);
    $('picture.ga-image-responsive').each((index, pictureElement) => {
    // For each <picture>, find all the <source> elements inside it
        $(pictureElement).find('img').each((imgIndex, imgElement) => { 
        const src = $(imgElement).attr('src');
        photo_links.push(src);
      });
    });

    const article = $('div[text="описание"] div.Zfnvl').text().replace(/\s+/g, ' ').trim();
    const description = $('div[itemprop="description"]').text();
    const brand = $('div[text="о бренде"] div.eqBV8').text().replace(/\s+/g, ' ').trim();

    const additional_info = $('div.ye9Ig').text().replace(/\s+/g, ' ').trim();
    const additional_info2 = $('div.eXXzH').text();
    
    return { subcategory, name, price, photo_links, article, description, brand, additional_info, additional_info2}

  } catch (error) {
    console.error(`Error getting product info`, error);
    return null;
  }
}

async function getProductInfo(page, url) {
  try {
    await navigateWithRetry(page, url);

    // const delay = 2000;
    // await waitForDelay(delay);
    await page.waitForSelector('div.wfChq');

    // Extract the full rendered HTML after JavaScript execution
    const content = await page.content();
    const $ = cheerio.load(content);

    const subcategory = $('div.-lCwe').text().replace(/\s+/g, ' ').trim();
    const name = $('h1.b8mg8').text().replace(/\s+/g, ' ').trim();
    const price = $('div[itemprop="priceSpecification"] meta[itemprop="price"]').attr('content').replace(/\s+/g, ' ').trim()
    + ' ' + $('div[itemprop="priceSpecification"] meta[itemprop="priceCurrency"]').attr('content').replace(/\s+/g, ' ').trim();

    // Loop through each <picture> element
    const photo_links = [];
    $('div.wfChq picture').each((index, pictureElement) => {
    // For each <picture>, find all the <img> elements inside it
        $(pictureElement).find('img').each((imgIndex, imgElement) => { 
        const src = $(imgElement).attr('src');
        photo_links.push(src);
      });
    });

    const article = $('div[text="описание"] div.Zfnvl').text().replace(/\s+/g, ' ').trim();
    const description = $('div[itemprop="description"]').text();
    const brand = $('div[text="о бренде"] div.eqBV8').text().replace(/\s+/g, ' ').trim();

    const additional_info = $('div.ye9Ig').text().replace(/\s+/g, ' ').trim();
    const additional_info2 = $('div.eXXzH').text();

    await page.waitForSelector('div[class="ga-select__box-content"]');
    await page.click('div[class="ga-select__box-content"]');
    // console.log(document.querySelector('div[class="ga-select__box-content"]').innerHTML);
    // Получаем все <li> элементы внутри div с классом ga-select__list
    const liElements = await page.$$(
      'div.ga-select-list__option'
    );
    console.log(liElements);

    // Для каждого <li> элемента кликнуть
    for (let li of liElements) {
      await li.click();  // Клик по элементу
      console.log('Кликнули на элемент');
      await waitForDelay(1000);; // Задержка 1 секунда
    }
    // await waitForDelay(2000);
    
    return { subcategory, name, price, photo_links, article, description, brand, additional_info, additional_info2}

  } catch (error) {
    console.error(`Error getting product info`, error);
    return null;
  }
}

// Function to wait for the page to load new content after scrolling
async function waitForDelay(delay) {
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Function for creating a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to generate a random number between min and max value
function getRandomDelay(min, max) {
  return Math.random() * (max - min) + min; // Random delay between 3000 ms (3 seconds) and 10000 ms (10 seconds)
}

// Function to add a random delay between requests (between min and max value)
async function addRandomDelay(min = 3000, max = 10000) {
  const randomDelay = getRandomDelay(min, max);
  console.log(`Waiting for ${(randomDelay / 1000).toFixed(1)} seconds...`);
  await delay(randomDelay);
}

// Function to get a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to manage opening a new tab and closing the old one
async function reopenNewTab(browser, page, queryCount, minQueries = 10, maxQueries = 20) {
  if (queryCount >= getRandomInt(minQueries, maxQueries)) {
    queryCount = 0; // Reset the query counter
    await page.close(); // Close the old tab
    page = await browser.newPage(); // Open a new tab
    console.log("Opening new tab...");
  }
  return { page, queryCount }; // Return updated page and queryCount
}


module.exports = { launchBrowser, navigateWithRetry, getCategoryLinks, getProductInfo, waitForDelay, addRandomDelay, reopenNewTab };
