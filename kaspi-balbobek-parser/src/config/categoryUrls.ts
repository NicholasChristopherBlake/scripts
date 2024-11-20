const merchantUrl =
  "https://kaspi.kz/shop/search/?q=%3AallMerchants%3A11208010";

const category1url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AChild%20goods%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category1urlpage = `https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AChild%20goods%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000`;
const category1pages = Math.floor(2711 / 12);

const category2url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3ABeauty%20care%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category2urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3ABeauty%20care%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category2pages = Math.floor(21 / 12);

const category3url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3ALeisure%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category3urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3ALeisure%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category3pages = Math.floor(2578 / 12);

const category4url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AHome%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category4urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AHome%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category4pages = Math.floor(125 / 12);

const category5url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AFashion%20accessories%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";

const category6url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AGifts%20and%20party%20supplies%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category6urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AGifts%20and%20party%20supplies%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category6pages = Math.floor(201 / 12);

const category7url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AOffice%20and%20school%20supplies%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category7urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AOffice%20and%20school%20supplies%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category7pages = Math.floor(155 / 12);

const category8url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3ASports%20and%20outdoors%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category8urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3ASports%20and%20outdoors%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category8pages = Math.floor(74 / 12);

const category9url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AFurniture%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
const category9urlpage =
  "https://kaspi.kz/yml/product-view/pl/results?page=1&q=%3Acategory%3AFurniture%3AallMerchants%3A11208010%3AavailableInZones%3AMagnum_ZONE5&text&sort=relevance&qs&ui=d&i=-1&c=710000000";
const category9pages = Math.floor(38 / 12);

const category10url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3ATV_Audio%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";

const category11url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3APharmacy%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";

const category12url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3ACar%20goods%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";

const category13url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AFashion%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=7100000000";

const category14url =
  "https://kaspi.kz/yml/product-view/pl/filters?q=%3AavailableInZones%3AMagnum_ZONE5%3Acategory%3AConstruction%20and%20repair%3AallMerchants%3A11208010&text&all=false&sort=relevance&ui=d&i=-1&c=710000000";
