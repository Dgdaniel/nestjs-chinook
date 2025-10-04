import {Document } from 'mongoose';
import { MediaType } from '../../media-type/interface/mediaType.interface';
import { Album } from '../../album/interface/album.interface';
import { Genre } from '../../genre/interface/genre.interface';
import { Playlist } from '../../playlist/interface/playlist.interface';

export interface Track extends Document {
  _id: string;
  name: string;
  composer: string;
  bytes: number;
  unitPrice: number;
  mediaType: MediaType;
  album: Album;
  genre: Genre;
  playlist: Playlist;
}