import axios from "axios";

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
  Accept: "application/json, text/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  Cookie:
    "_ga=GA1.1.1799145568.1725711949; _ga_0R30CM934D=GS1.1.1725711948.1.0.1725712995.60.0.0; ks.tg=79; k_stat=bcac256f-6739-4798-bd5b-9896fa61ea7a; locale=ru-RU; kaspi.storefront.cookie.city=710000000",
  Host: "kaspi.kz",
  Referer: "https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010",
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

const firstCategoryUrl =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AChild%20goods%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const firstCategoryUrlPage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AChild%20goods%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";

/**
 * Функция для парсинга данных с указанного URL.
 * @param {string} url - URL страницы для парсинга.
 * @returns {Promise<any>} - Объект с результатами парсинга.
 */
export async function parseFirstPageKaspi(url: string): Promise<any> {
  try {
    console.log(`Обрабатываем url: ${url}`);
    // Отправляем GET-запрос к URL
    const response = await axios.get(url, { headers });
    const cards = response.data.data.cards;

    return cards.map((card: any) => ({
      id: card.id,
      title: card.title,
      brand: card.brand,
      categoryId: card.categoryId,
      hasVariants: card.hasVariants,
      loanAvailable: card.loanAvailable,
      shopLink: card.shopLink,
      unitPrice: card.unitPrice,
      unitSalePrice: card.unitSalePrice,
      priceFormatted: card.priceFormatted,
      createdTime: card.createdTime,
      stickers: card.stickers,
      previewImages: card.previewImages,
      creditMonthlyPrice: card.creditMonthlyPrice,
      monthlyInstallment: card.monthlyInstallment,
      reviewsLink: card.reviewsLink,
      weight: card.weight,
      unit: card.unit,
      rating: card.rating,
      reviewsQuantity: card.reviewsQuantity,
      stock: card.stock,
      currency: card.currency,
      mods: card.mods,
      deliveryDuration: card.deliveryDuration,
      category: card.category,
      categoryCodes: card.categoryCodes,
      groups: card.groups,
      promo: card.promo,
      majorMerchants: card.majorMerchants,
      deliveryZones: card.deliveryZones,
    }));
  } catch (error) {
    console.error(`Ошибка при парсинге url ${url}`, error);
    return {
      error: "Не удалось загрузить данные с URL",
    };
  }
}

export async function parseOtherPageKaspi(url: string): Promise<any> {
  try {
    console.log(`Обрабатываем url: ${url}`);
    // Отправляем GET-запрос к URL
    const response = await axios.get(url, { headers });
    const cards = response.data.data;

    return cards.map((card: any) => ({
      id: card.id,
      title: card.title,
      brand: card.brand,
      categoryId: card.categoryId,
      hasVariants: card.hasVariants,
      loanAvailable: card.loanAvailable,
      shopLink: card.shopLink,
      unitPrice: card.unitPrice,
      unitSalePrice: card.unitSalePrice,
      priceFormatted: card.priceFormatted,
      createdTime: card.createdTime,
      stickers: card.stickers,
      previewImages: card.previewImages,
      creditMonthlyPrice: card.creditMonthlyPrice,
      monthlyInstallment: card.monthlyInstallment,
      reviewsLink: card.reviewsLink,
      weight: card.weight,
      unit: card.unit,
      rating: card.rating,
      reviewsQuantity: card.reviewsQuantity,
      stock: card.stock,
      currency: card.currency,
      mods: card.mods,
      deliveryDuration: card.deliveryDuration,
      category: card.category,
      categoryCodes: card.categoryCodes,
      groups: card.groups,
      promo: card.promo,
      majorMerchants: card.majorMerchants,
      deliveryZones: card.deliveryZones,
    }));
  } catch (error) {
    console.error(`Ошибка при парсинге url ${url}`, error);
    return {
      error: "Не удалось загрузить данные с URL",
    };
  }
}

// parseFirstPageKaspi(firstCategoryUrl);
