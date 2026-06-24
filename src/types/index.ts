export type ObtainSource =
  | { type: 'monster'; monsterId: number; monsterName: string; map: string; dropRate: number }
  | { type: 'shop'; npcName: string; map: string; price: number }
  | { type: 'quest'; questName: string; description: string };

export interface RecipeIngredient {
  itemId: number;
  quantity: number;
}

export interface Recipe {
  npcName: string;
  map: string;
  zeny?: number;
  ingredients: RecipeIngredient[];
}

export interface Item {
  id: number;
  name: string;
  type: string;
  description: string;
  episode?: number;
  imageUrl?: string;
  recipe?: Recipe;
  obtainFrom: ObtainSource[];
  categories?: string[];
}

export interface ItemDB {
  [id: string]: Item;
}

export interface Instance {
  id: number;
  name: string;
  minLevel: number;
  maxParty: number;
  cooldown: string;
  episode: number;
  description: string;
  dropItemIds: number[];
}
