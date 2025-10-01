
import { DATABASE_CONNECTION, PLAYLIST_MODEL } from '../constants/object.constants';
import { Connection } from 'mongoose';
import { PlaylistSchema } from '../schemas/Playlist.schema';

export const playlistProvider = [{
  provide: PLAYLIST_MODEL,
  useFactory: (connection: Connection) => connection.model(PLAYLIST_MODEL, PlaylistSchema),
  inject: [DATABASE_CONNECTION],
}]
