export interface Sprite {
  id: number;
  filename: string;
  title: string;
  genre: string;
  songTitle: string;
  animationMethods: string;
}

export interface SpriteData {
  sprites: Sprite[];
}