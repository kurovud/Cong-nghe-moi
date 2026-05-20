const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='480' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23f3f4f6'/%3E%3Crect x='176' y='120' width='288' height='192' rx='16' fill='%23d1d5db'/%3E%3Ccircle cx='260' cy='196' r='28' fill='%239ca3af'/%3E%3Cpath d='M204 288l72-76 56 56 44-44 60 64z' fill='%239ca3af'/%3E%3Ctext x='320' y='352' font-family='Arial,sans-serif' font-size='22' text-anchor='middle' fill='%236b7280'%3ENo image%3C/text%3E%3C/svg%3E";

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function resolveProductImage(
  image?: string | null,
  category?: string
): string {
  if (!image || typeof image !== "string") {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (image.startsWith("data:") || ABSOLUTE_URL_PATTERN.test(image)) {
    return image;
  }

  const normalized = image.replace(/\\/g, "/").trim();

  const nestedProductMatch = normalized.match(/^\/images\/products\/([^/]+)\/(.+)$/i);
  if (nestedProductMatch) {
    const [, nestedCategory, filename] = nestedProductMatch;
    return `/images/${nestedCategory.toLowerCase()}/${filename}`;
  }

  const flatProductMatch = normalized.match(/^\/images\/products\/(.+)$/i);
  if (flatProductMatch) {
    const [, filename] = flatProductMatch;
    if (category) {
      return `/images/${category.toLowerCase()}/${filename}`;
    }
  }

  return normalized;
}

export function normalizeProductImage<T extends { image?: string | null; category?: string }>(
  product: T
): T {
  return {
    ...product,
    image: resolveProductImage(product?.image, product?.category),
  };
}

export function normalizeProductImageList<T extends { image?: string | null; category?: string }>(
  products: T[]
): T[] {
  return products.map(normalizeProductImage);
}
