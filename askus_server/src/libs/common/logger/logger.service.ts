import { ConsoleLogger, LoggerService, LogLevel } from "@nestjs/common";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";

export class CustomLogger implements LoggerService {
    private readonly logFile = join(__dirname, "../../../../logs/app.log");
    private readonly consoleLogger = new ConsoleLogger();

    private writeToFile(level: LogLevel, message: any, context?: string, trace?: string) {
        const time = new Date().toISOString();
        const log = `[${time}] [${level}]${context ? ` [${context}]` : ""} ${message}${trace ? `\nTRACE: ${trace}` : ""}\n`;

        const logDir = dirname(this.logFile);

        if (!existsSync(logDir)) {
            mkdirSync(logDir, { recursive: true });
        }

        appendFileSync(this.logFile, log);
    }

    log(message: any, context: string) {
        this.writeToFile("log", message, context);
        this.consoleLogger.log(message, context);
    }

    error(message: any, trace?: string, context?: string) {
        this.writeToFile("error", message, context, trace);
        this.consoleLogger.error(message, trace, context);
    }

    warn(message: any, context: string) {
        this.writeToFile("warn", message, context);
        this.consoleLogger.warn(message, context);
    }

    debug(message: any, context: string) {
        this.writeToFile("debug", message, context);
        this.consoleLogger.debug(message, context);
    }

    verbose(message: any, context: string) {
        this.writeToFile("verbose", message, context);
        this.consoleLogger.verbose(message, context);
    }
}
