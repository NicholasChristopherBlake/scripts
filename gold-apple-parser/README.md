# **_gold_apple_parser_**

Скрипт для парсинга данных с сайта Золотое Яблоко.

1. Предварительно полученные ссылки по товарам берутся из файла `category_links.xlsx`
2. Список категорий находится в файле `util/config.js` - categories:

```js
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
```

3. Запускается скрипт командой `pnpm start`. В файле `gold_apple.js` в самой последней строчке `fetchAndParseAllCategoryProducts(categories[4]);` необходимо заменить номер категории (из списка выше) на нужную Вам.

4. Данные выгружаются в файл `products_info.xlsx`. ВАЖНО! После выгрузки каждой категории копируйте данные и файл, т.к. при следующем запуске скрипта данные в файле будут заменяться.

## Установка

1. Установите NodeJS (при установке поставьте галочку для добавления переменной PATH) и npm на компьютер.

2. Перезагрузите ПК.

3. Проверьте установлены ли NodeJS и npm с помощью команд ниже в коммандной строке windows или терминале VSCode.

```bash
node --version
npm --version
```

4. Установите VSCode

5. Установите pnpm в терминале VSCode. Терминал открывается Ctrl + Shift + `

```bash
npm install -g pnpm
```

Проверьте, что pnpm установился `pnpm --version`

6. Скопируйте этот скрипт в папку

7. В VSCode откройте папку со скриптом (в терминале путь должен быть примерно такой: C:\Projects\gold-apple-parser)

8. В терминале VSCode введите эту команду, чтобы установить зависимости. Должна появиться папка node_modules.

```bash
pnpm install
```

9. Запускайте скрипт с помощью команды:

```bash
pnpm start
```

10. В файле `gold_apple.js` в самой последней строчке `fetchAndParseAllCategoryProducts(categories[4]);` необходимо заменить номер категории (из списка выше) на нужную Вам. Об этом подробнее сказано выше.

11. Данные выгружаются в файл `products_info.xlsx`. ВАЖНО! После выгрузки каждой категории копируйте данные и файл, т.к. при следующем запуске скрипта данные в файле будут заменяться.

## Возможные проблемы

Если скрипт в какой-то момент зависает и не справляется - попробуйте уменьшить количество входных данных. Разделите количество ссылок в файле `category_links` на несколько частей и запустите по частям. Названия Листов в Excel файле не изменяйте.

Если какие-то данные не были получены - скопируйте эти ссылки и запустите скрипт по ним еще раз. Некоторые данные могут пропускаться из-за медленного ответа сервера, при повторном запуске эти данные скорее всего будут получены.

Не переименовывайте и не удаляйте Excel файлы.