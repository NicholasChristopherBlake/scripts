const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const requestHeaders1 = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, compress, deflate, br",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Referer: "https://kaspi.kz/",
};

const requestHeaders2 = {
  Accept: "application/json, text/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  "Content-Length": 346,
  "Content-Type": "application/json; charset=UTF-8",
  Cookie:
    "_ga=GA1.1.1799145568.1725711949; _ga_0R30CM934D=GS1.1.1725711948.1.0.1725712995.60.0.0; ks.tg=79; k_stat=bcac256f-6739-4798-bd5b-9896fa61ea7a; locale=ru-RU; kaspi.storefront.cookie.city=710000000",
  Host: "kaspi.kz",
  Origin: "https://kaspi.kz",
  Referer:
    "https://kaspi.kz/shop/p/kalligraficheskaja-propis-pishem-slogi-i-slova-106299957/?c=710000000&m=11208010",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  "X-KS-City": 710000000,
  "sec-ch-ua":
    '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

const requestHeaders3 = {
  Accept: "application/json, text/*",
  "Accept-Encoding": "gzip, compress, deflate, br",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Referer: "https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010&page=13",
};

const requestHeaders4 = {
  Accept: "application/json, text/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Cookie:
    "ks.tg=81; k_stat=e2d8e8e2-0b70-4114-a22d-0fdbd5c3be06; kaspi.storefront.cookie.city=710000000",
  Host: "kaspi.kz",
  Pragma: "no-cache",
  // Referer: "https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010&page=16",
  Referer:
    "https://kaspi.kz/shop/nur-sultan/c/child%20goods/?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AChild%20goods%3AallMerchants%3A11208010&sort=relevance&sc&page=5",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  "X-KS-City": "710000000",
  "sec-ch-ua":
    '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

const requestParamsCategory = {
  page: 226,
  q: ":category:Child goods:allMerchants:11208010:availableInZones:Magnum_ZONE5",
  text: "",
  sort: "relevance",
  qs: "",
  ui: "d",
  i: -1,
  c: 710000000,
};

const requestParamsPage = {
  c: 710000000,
  m: 11208010, // Balbobek merchant
};

const requestHeadersPage = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  Cookie:
    "layout=d; ks.tg=81; k_stat=e2d8e8e2-0b70-4114-a22d-0fdbd5c3be06; kaspi.storefront.cookie.city=710000000",
  Host: "kaspi.kz",
  Pragma: "no-cache",
  Referer:
    "https://kaspi.kz/shop/nur-sultan/c/child%20goods/?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AChild%20goods%3AallMerchants%3A11208010&sort=relevance&sc&page=2",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  "sec-ch-ua":
    '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

async function parseOne() {
  // const encodedText = `КАЛЛИГРАФИЧЕСКАЯ%20ПРОПИСЬ%20А5.%20альбомная.%20"ПИШЕМ%20СЛОВА"`;
  // const url = `https://kaspi.kz/shop/search/?text=${encodedText}&q=%3Acategory%3ACategories%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE1&sort=relevance&filteredByCategory=false&sc=`;
  // const url = `https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3ACategories%3AavailableInZones%3AMagnum_ZONE5&text=%D0%9A%D0%90%D0%9B%D0%9B%D0%98%D0%93%D0%A0%D0%90%D0%A4%D0%98%D0%A7%D0%95%D0%A1%D0%9A%D0%90%D0%AF%20%D0%9F%D0%A0%D0%9E%D0%9F%D0%98%D0%A1%D0%AC%20%D0%905.%20%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC%D0%BD%D0%B0%D1%8F.%20%22%D0%9F%D0%98%D0%A8%D0%95%D0%9C%20%D0%A1%D0%9B%D0%9E%D0%92%D0%90%22&sort=relevance&qs&ui=d&i=-1&c=710000000`;
  // const url = `https://kaspi.kz/shop/p/kalligraficheskaja-propis-pishem-slogi-i-slova-106299957/?c=710000000&m=11208010`;
  // const url = `https://kaspi.kz/yml/offer-view/offers/106299957`;
  // const url = `https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010&page=15`;
  // const url = `https://kaspi.kz/yml/product-view/pl/results?page=14&q=%3Acategory%3ACategories%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000`;
  console.log(`Fetching page`);
  // const url = `/yml/product-view/pl/results?page=16&q=%3Acategory%3ACategories%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000 HTTP/1.1`;

  try {
    // Fetch page HTML
    // const response = await axios.get(url, {
    //   headers: requestHeaders3,
    // });
    const response = await axios.get(
      "https://kaspi.kz/shop/p/igrushka-mjalka-kabi-myshki-v-syre-mul-tikolor-101702941/",
      {
        headers: requestHeadersPage,
        params: requestParamsPage,
      }
    );
    console.log(response.data);
    // const $ = cheerio.load(response.data.data);
    // console.log($("item-cards-grid").prop("innerHTML"));

    // console.log($.html());
  } catch (error) {
    console.error(`Error fetching page`, error);
    return {};
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openPageAndWait() {
  const browser = await puppeteer.launch({ headless: false }); // Launch the browser
  const page = await browser.newPage(); // Create a new page

  try {
    // Navigate to the URL and wait for the page to load
    await page.goto(
      "https://kaspi.kz/shop/search/?text=%D0%9A%D0%90%D0%9B%D0%9B%D0%98%D0%93%D0%A0%D0%90%D0%A4%D0%98%D0%A7%D0%95%D0%A1%D0%9A%D0%90%D0%AF%20%D0%9F%D0%A0%D0%9E%D0%9F%D0%98%D0%A1%D0%AC%20%D0%905.%20%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC%D0%BD%D0%B0%D1%8F.%20%22%D0%9F%D0%98%D0%A8%D0%95%D0%9C%20%D0%A1%D0%9B%D0%9E%D0%92%D0%90%22&q=%3AavailableInZones%3AMagnum_ZONE5&sort=relevance&filteredByCategory=false&sc=",
      {
        waitUntil: "networkidle2", // Wait until there are no more than 2 network connections for at least 500 ms
      }
    );

    await delay(100000);
  } catch (error) {
    console.error("Error occurred while opening the page:", error.message);
  } finally {
    await browser.close(); // Close the browser after the task is completed
  }
}

parseOne();

// openPageAndWait();
