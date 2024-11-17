const path = require("path");

const categories = [
  {id: 0, url: 'lajm', description: 'Наша коллекция'},
  {id: 1, url: 'azija', description: 'Азия'},
  {id: 2, url: 'makijazh', description: 'Макияж'},
  {id: 3, url: 'uhod', description: 'Уход'},
  {id: 4, url: 'volosy', description: 'Волосы'},
  {id: 5, url: 'parfjumerija', description: 'Парфюмерия'},
  {id: 6, url: 'aptechnaja-kosmetika', description: 'Аптечная косметика'},
  {id: 7, url: 'organika', description: 'Органика'},
  {id: 8, url: 'dlja-muzhchin', description: 'Для мужчин'},
  {id: 9, url: 'detjam', description: 'Детям'},
  {id: 10, url: 'aksessuary', description: 'Аксессуары'},
  {id: 11, url: 'hozjajstvennye-tovary', description: 'Уборка и гигиена'},
  {id: 12, url: 'tehnika-dlja-krasoty-i-zdorov-ja', description: 'Техника'},
  {id: 13, url: 'mini-formaty', description: 'Тревел-форматы'},
  {id: 14, url: 'podarochnye-nabory', description: 'Подарочные наборы'},
  {id: 15, url: 'exclusives', description: 'Эксклюзивные бренды'},
];

const uhod_subcategories = [
  {id: 1, url: 'uhod/uhod-za-licom', description: 'Уход за лицом'},
  {id: 2, url: 'uhod/uhod-za-telom', description: 'Уход за телом'},
  {id: 3, url: 'uhod/solnechnaja-linija', description: 'Солнечная линия'},
  {id: 4, url: 'uhod/kosmecevtika', description: 'Космецевтика'},
  {id: 5, url: 'uhod/uhod-za-polost-ju-rta', description: 'Уход за полостью рта'},
  {id: 6, url: 'uhod/detskij-uhod', description: 'Детский уход'},
  {id: 7, url: 'uhod/lichnaja-gigiena', description: 'Личная гигиена'},
  {id: 8, url: 'uhod/nabory', description: 'Наборы'},
  {id: 9, url: 'uhod/aksessuary', description: 'Аксессуары'},
  {id: 10, url: 'uhod/novinki', description: 'Новинки'}
]


module.exports = {
  categories,
  uhod_subcategories,
  folderPath: path.join(__dirname, "..", "golden_apple_data"),
  linksFilePath: path.join(__dirname, "..", "golden_apple_data", "category_links.xlsx"),
  infoFilePath: path.join(__dirname, "..", "golden_apple_data", "products_info.xlsx"),
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
};