import { ALBUM_MODEL, DATABASE_CONNECTION } from "src/constants/object.constants";
import { AlbumSchem } from "src/schemas/Album.schema";

export const AlbumProvider = [
    {
        provide: ALBUM_MODEL,
        useFactory: (connection: any) => connection.model(ALBUM_MODEL, AlbumSchem),
        inject: [DATABASE_CONNECTION],
    },
];