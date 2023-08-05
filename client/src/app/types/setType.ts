import { Minigifure } from './minifigureType';

export type Set = {
  _id: string;
  setNum: string;
  name: string;
  year: number;
  parts: number;
  image: string;
  minifigCount: number;
  minifigs: Minigifure[];
  userImage?: string;
  username?: string;
  review?: string;
};
