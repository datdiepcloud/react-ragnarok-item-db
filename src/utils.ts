const CDN = 'https://static.divine-pride.net/images/items/item';

export function itemIconUrl(id: number, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  return `/icons/${id}.png`;
}

export function itemIconFallback(id: number): string {
  return `${CDN}/${id}.png`;
}
