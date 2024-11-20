# **_excel-barcode-url-fetcher_**

Script for scraping Google Images.

1. From Excel table `test_data.xlsx` script takes a product's barcode
2. Searches the barcode in Google Images
3. Retrieves data from the first relevant image: image's origin link, image's alt text and actual image in base64 format from Google Images
4. Saves this data to the columns in Excel table `/data/data_with_images.xlsx` (barcode | link | text | image)
5. Saves base64 image from Google into `/images` folder

1 barcode search takes about 10-13 seconds. There's a randomized delay between queries from 2 to 5 seconds to mimic the user's behaviour.
Every 3 to 6 queries (randomly) the old tab is closed and the new tab is opened.

## Installation

1. Ensure that you have NodeJS and npm installed

```bash
node --version
npm --version
```

2. Install pnpm globally

```bash
npm install -g pnpm
```

Ensure that it is installed with `pnpm --version`

3. Download or clone this script folder via `git clone`

4. Install dependencies using pnpm

```bash
pnpm install
```

5. Put your data into `data/test_data.xlsx` file, or change `getImageUrl.js` to work with another file of your choice

6. Run the script

```bash
pnpm start
```

7. The result will be inside `/data/data_with_images.xlsx` file

## Issues

The main problem was with how Google shows the links to the image's origin. For some reason, maybe security, they hide it and I was able to load it only after Puppeteer hovered over this image.

Also, we need to additionally wait for 4 seconds for the page to fully load to get the image's url.
And to mimic user's behaviour there are also some delays between queries and during query.

## Libraries

- **ExcelJS** and **xlsx** for working with Excel tables. ExcelJS being more advanced one and allowing us to add images into Excel table.
- **Puppeteer** for making search requests in browser and getting the data.
