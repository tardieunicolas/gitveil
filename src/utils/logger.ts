import * as fs from 'fs';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';

// S'assurer que le dossier log existe
const logDir = path.resolve(__dirname, '../../log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDir, 'gitpulse.log') })
    ],
});

export const log = (level: 'info' | 'warn' | 'error', message: string) => {
    logger.log({ level, message });
};