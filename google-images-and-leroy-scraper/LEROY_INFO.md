**getLeroyInfo.js**

Script for fetching information from LeroyMarket.kz

Gets description and links to images for an item code.

Run script

```bash
pnpm start-leroy
```

Excel file is being saved after each iteration (but the styles to link columns are not being applied in case of an error). So you can close this script anytime you want (there just won't be any styles).

Tries to refetch using Puppeteer 3 times maximum (10 seconds wait time for a page load).

Browser tab is refreshed after 10-20 queries.
Random delay between queries - 3-6 seconds.
