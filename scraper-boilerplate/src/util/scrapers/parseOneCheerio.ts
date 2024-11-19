import axios from "axios";
import cheerio from "cheerio";

// Интерфейсы для типизации
interface ScraperResult {
  title: string;
  links: string[];
  error?: string;
}

/**
 * Функция для парсинга данных с указанного URL.
 * @param {string} url - URL страницы для парсинга.
 * @returns {Promise<ScraperResult>} - Объект с результатами парсинга.
 */
export async function parseOne(url: string): Promise<ScraperResult> {
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
    "User-Agent": randomUserAgent,
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: url, // Может быть полезно для некоторых сайтов
  };

  try {
    // Отправляем GET-запрос к URL
    const { data } = await axios.get(url, { headers });

    // Загружаем HTML в Cheerio
    const $ = cheerio.load(data);

    // Извлекаем title страницы
    const title = $("title").text();

    // Извлекаем все ссылки с страницы
    const links: string[] = [];
    $("a").each((i, element) => {
      const href = $(element).attr("href");
      if (href) links.push(href);
    });

    return {
      title,
      links,
    };
  } catch (error) {
    console.error(`Ошибка при парсинге url ${url}`, error);
    return {
      error: "Не удалось загрузить данные с URL",
      title: "",
      links: [],
    };
  }
}
