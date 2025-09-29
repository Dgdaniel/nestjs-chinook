import { ALBUM_MODEL, DATABASE_CONNECTION } from "src/constants/object.constants";
import { AlbumSchem } from "src/schemas/Album.schema";
import { Connection } from 'mongoose';

export const albumProvider = [
    {
        provide: ALBUM_MODEL,
        useFactory: (connection: Connection) => connection.model("Album", AlbumSchem),
        inject: [DATABASE_CONNECTION],
    },
];