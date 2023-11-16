import { Minigifure } from './minifigureType';

export interface ReviewCreateForm {
  _id: string;
  content: string;
  setVideoIds: string;
  setImages: string[];
}

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
