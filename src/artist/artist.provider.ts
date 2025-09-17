import { Connection } from "mongoose";
import { ARTIST_MODEL, DATABASE_CONNECTION } from "../constants/object.constants";
import { ArtistSchema } from "src/schemas/Artist.schema";

export const artistProvider = [
  {
    provide: ARTIST_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Artist', ArtistSchema),
    inject: [DATABASE_CONNECTION],
  },
];