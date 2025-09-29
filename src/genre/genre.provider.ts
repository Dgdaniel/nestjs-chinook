import { GenreService } from './genre.service';
import { Connection } from "mongoose";
import {
  DATABASE_CONNECTION,
  GENRE_MODEL,
} from '../constants/object.constants';
import { GenreSchema } from '../schemas/Genre.Schema';

export const genreProvider = [
  {
    provide: GENRE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Genre', GenreSchema),
    inject: [DATABASE_CONNECTION],
  },
];
