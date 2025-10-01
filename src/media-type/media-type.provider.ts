import { DATABASE_CONNECTION, MEDIA_TYPE_MODEL } from '../constants/object.constants';
import { Connection } from 'mongoose';
import { MediaTypeSchema } from '../schemas/MediaType.schema';

export const mediaTypeProvider = [{
  provide: MEDIA_TYPE_MODEL,
  useFactory: (connection: Connection) => connection.model(MEDIA_TYPE_MODEL, MediaTypeSchema),
  inject: [DATABASE_CONNECTION],
}]
