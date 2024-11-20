import axios from "axios";
import * as cheerio from "cheerio";

// Случайные user agents для обхода блокировки
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
];

const randomUserAgent =
  userAgents[Math.floor(Math.random() * userAgents.length)];

// Заголовки для запроса
const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  Cookie:
    "layout=d; _ga=GA1.1.1799145568.1725711949; _ga_0R30CM934D=GS1.1.1725711948.1.0.1725712995.60.0.0; ks.tg=79; k_stat=bcac256f-6739-4798-bd5b-9896fa61ea7a; locale=ru-RU; kaspi.storefront.cookie.city=710000000",
  Host: "kaspi.kz",
  Referer: "https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010",
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

/**
 * Функция для парсинга данных с указанного URL.
 * @param {string} url - URL страницы для парсинга.
 * @returns {Promise<any>} - Объект с результатами парсинга.
 */
export async function parseOneProductKaspi(url: string): Promise<any> {
  try {
    console.log(`Обрабатываем url: ${url}`);
    // Отправляем GET-запрос к URL
    const response = await axios.get(url, { headers });
    const data = response.data;

    // Загружаем HTML в Cheerio
    const $ = cheerio.load(data);

    let article = $("div.item__sku").text() || "";
    if (article) {
      article = article.replace(/[^0-9]/g, "");
    }

    const title = $("h1.item__heading").text() || "";

    const short_specifications: string[] = [];
    $(".short-specifications li").each((index, element) => {
      short_specifications.push($(element).text()?.trim()) || ""; // Получаем текст каждого <li> и добавляем в массив
    });

    const description =
      $(".description p")
        .map((index, element) => $(element).text()?.trim()) // Извлекаем текст
        .get() // Преобразуем в массив
        .join("\n") || ""; // Объединяем абзацы с новой строкой

    const characterictics: any[] = [];
    $(".specifications-list__el").each((index, element) => {
      const category =
        $(element).find(".specifications-list__header").text()?.trim() || ""; // Заголовок категории
      const details: any[] = [];

      // Перебираем вложенные <dl> внутри <dd>
      $(element)
        .find(".specifications-list__spec")
        .each((_, spec) => {
          const term =
            $(spec)
              .find(".specifications-list__spec-term-text")
              .text()
              ?.trim() || ""; // Название характеристики
          const definition =
            $(spec)
              .find(".specifications-list__spec-definition")
              .text()
              ?.trim() || ""; // Значение характеристики
          details.push({ term, definition });
        });

      characterictics.push({ category, details });
    });

    const categories =
      $(".breadcrumbs a")
        .map((index, element) => $(element).text()?.trim()) // Извлекаем текст из каждой ссылки
        .get() // Преобразуем в массив
        .join(" - ") || ""; // Объединяем с разделителем " - "

    return [
      {
        url,
        article,
        title,
        short_specifications,
        description,
        characterictics,
        categories,
      },
    ];
  } catch (error) {
    console.error(`Ошибка при парсинге url ${url}`, error);
    return [
      {
        url: "",
        article: "",
        title: "",
        short_specifications: [],
        description: "",
        characterictics: [],
        categories: "",
        error: "Не удалось загрузить данные с URL",
      },
    ];
  }
}
