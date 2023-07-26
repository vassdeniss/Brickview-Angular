import { Minigifure } from './minifigureType';
import { Set } from './setType';
import { User } from './userType';

export interface Review {
  buildExperience: string;
  design?: string;
  minifigures?: Minigifure[] | string;
  value?: string;
  other?: string;
  verdict?: string;
  imageSources?: string[];
  set: Set | string;
  user?: User | string;
}
