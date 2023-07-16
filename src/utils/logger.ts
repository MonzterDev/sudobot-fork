import { developmentMode } from "./utils";

export enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    CRITICAL
}

export function logWithLevel(level: LogLevel = LogLevel.DEBUG, ...message: any[]) {
    if (level === LogLevel.DEBUG) {
        if (!developmentMode())
            return;

        console.debug(...message);
    }
    else if (level === LogLevel.INFO)
        console.info(...message);
    else if (level === LogLevel.WARN)
        console.warn(...message);
    else if (level === LogLevel.ERROR)
        console.error(...message);
    else if (level === LogLevel.CRITICAL) {
        console.error(...message);
        console.log("Critical error occurred. Exitting.");
        process.exit(-1);
    }
}

export function log(...message: any[]) {
    return logWithLevel(LogLevel.DEBUG, ...message);
}

export function logError(...message: any[]) {
    return logWithLevel(LogLevel.ERROR, ...message);
}

export function logInfo(...message: any[]) {
    return logWithLevel(LogLevel.INFO, ...message);
}

export function logWarn(...message: any[]) {
    return logWithLevel(LogLevel.WARN, ...message);
}