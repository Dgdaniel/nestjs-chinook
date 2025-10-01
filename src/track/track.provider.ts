import {
  DATABASE_CONNECTION,
  TRACK_MODEL,
} from '../constants/object.constants';
import { Connection } from 'mongoose';
import { TrackSchema } from '../schemas/Track.schema';

export const trackProvider = [{
  provide: TRACK_MODEL,
  useFactory: (connection: Connection)=>
    connection.model(TRACK_MODEL, TrackSchema),
  inject: [DATABASE_CONNECTION]
}]