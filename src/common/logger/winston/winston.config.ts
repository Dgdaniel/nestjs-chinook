import { utilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'winston-mongodb';

/**
 * Configuration pour la rotation des fichiers
 */
const createFileRotateTransport = () =>
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  });

/**
 * Rotation spécifique pour les erreurs
 */
const createErrorRotateTransport = () =>
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
  });

/**
 * Options de configuration MongoDB
 */
interface MongoConfig {
  db: string;
  collection?: string;
  expireAfterSeconds?: number;
}

/**
 * Crée la configuration du logger
 */
export const createLoggerConfig = (
  useMongo: boolean = false,
  mongoConfig?: MongoConfig
) => {
  const logTransports: winston.transport[] = [
    // Console (toujours actif)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.errors({ stack: true }),
        utilities.format.nestLike('MaarchNextCloud', {
          colors: true,
          prettyPrint: true,
          processId: true,
        })
      ),
    }),
    // Rotation de fichiers
    createFileRotateTransport(),
    createErrorRotateTransport(),
  ];

  // Ajouter MongoDB si demandé
  if (useMongo) {
    const config = mongoConfig || {
      db: process.env.MONGO_URL || 'mongodb://localhost:27017/logs',
      collection: 'application_logs',
      expireAfterSeconds: 2592000, // 30 jours
    };

    logTransports.push(
      new winston.transports.MongoDB({
        db: config.db,
        collection: config.collection || 'application_logs',
        options: {
          useUnifiedTopology: true,
        },
        metaKey: 'metadata',
        expireAfterSeconds: config.expireAfterSeconds,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  }

  return {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: logTransports,
    exitOnError: false,
    handleExceptions: true,
    handleRejections: true,
  };
};