export const LOCAL_ASSETS = {
  hero: '/assets/catalog/roller-blinds.webp',
  placeholder: '/assets/placeholders/product-placeholder.svg',
  wallpaperCategory: '/assets/placeholders/wallpapers-category.svg',
  wallpaperLinen: '/assets/placeholders/wallpaper-linen.svg',
  wallpaperGeometric: '/assets/placeholders/wallpaper-geometric.svg',
  categories: {
    'roller-blinds': '/assets/catalog/roller-blinds.webp',
    'zebra-blinds': '/assets/catalog/zebra-blinds.webp',
    'venetian-blinds': '/assets/catalog/venetian-blinds.jpg',
    'honeycomb-blinds': '/assets/catalog/honeycomb-blinds.webp',
    'roman-blinds': '/assets/catalog/roman-blinds.webp',
    'curtains-drapes': '/assets/catalog/curtains-drapes.jpg',
    wallpapers: '/assets/placeholders/wallpapers-category.svg',
    'wooden-flooring': '/assets/catalog/wooden-flooring.jpg',
    awnings: '/assets/catalog/awnings.jpg',
  },
};

const REMOTE_TO_LOCAL = {
  'https://www.mac.in/assets/site/images/product/iterior-blind/roller-blinds.webp': '/assets/catalog/roller-blinds.webp',
  'https://www.mac.in/assets/site/images/product/iterior-blind/zebrano.webp': '/assets/catalog/zebra-blinds.webp',
  'https://www.mac.in/assets/site/images/Products1/1.jpg': '/assets/catalog/venetian-blinds.jpg',
  'https://www.mac.in/assets/site/images/product/iterior-blind/honeycell.webp': '/assets/catalog/honeycomb-blinds.webp',
  'https://www.mac.in/assets/site/images/product/iterior-blind/roman-blinds.webp': '/assets/catalog/roman-blinds.webp',
  'https://www.mac.in/assets/site/images/product/curtain-system/curtain-road.jpg': '/assets/catalog/curtains-drapes.jpg',
  'https://www.mac.in/assets/site/images/product/curtain-system/curtain-track.jpg': '/assets/products/curtain-track.jpg',
  'https://www.mac.in/assets/site/images/product/Woven-Vinyl/pic-1.jpg': '/assets/products/engineered-oak-flooring.jpg',
  'https://www.mac.in/assets/site/images/product/Woven-Vinyl/slider-1.jpg': '/assets/catalog/wooden-flooring.jpg',
  'https://www.mac.in/assets/site/images/product/awnings/pic-1.jpg': '/assets/products/retractable-patio-awning.jpg',
  'https://www.mac.in/assets/site/images/product/awnings/slider-1.jpg': '/assets/catalog/awnings.jpg',
  'https://www.mac.in/assets/site/images/product/iterior-blind/MOTORISED-BLINDS.webp': '/assets/blog/motorised-blinds.webp',
  '/images/categories/wallpapers.jpg': '/assets/placeholders/wallpapers-category.svg',
  '/images/products/wallpaper-linen.jpg': '/assets/placeholders/wallpaper-linen.svg',
  '/images/products/wallpaper-geometric.jpg': '/assets/placeholders/wallpaper-geometric.svg',
  '/images/placeholder.jpg': '/assets/placeholders/product-placeholder.svg',
};

export function localizeImagePath(path, fallback = LOCAL_ASSETS.placeholder) {
  if (!path) return fallback;
  if (REMOTE_TO_LOCAL[path]) return REMOTE_TO_LOCAL[path];
  if (path.startsWith('http://') || path.startsWith('https://')) return fallback;
  return path;
}

export function localizeImages(paths = [], fallback = LOCAL_ASSETS.placeholder) {
  return paths.map((path) => localizeImagePath(path, fallback));
}
