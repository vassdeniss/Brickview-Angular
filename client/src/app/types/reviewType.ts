import { Minigifure } from './minifigureType';

export interface Review {
  _id: string;
  setName?: string;
  setImage?: string;
  setNumber?: string;
  setParts?: string;
  setYear?: string;
  setMinifigCount?: string;
  setImages: string[];
  setVideoIds?: string[];
  setMinifigures?: Minigifure[];
  userId?: string;
  userUsername?: string;
  content?: string;
}
