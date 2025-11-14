import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse() as Response;
        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const message = exception instanceof HttpException ? exception.message : "Internal server error";

        this.logger.error(message);

        response.status(status).json({
            status,
            message,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url
        });
    }
}