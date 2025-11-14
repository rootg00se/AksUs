import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { type Request, type Response } from "express";
import { map, Observable } from "rxjs";

export interface ResponseType<T> {
    data: T;
    timestamp: string;
    path: string;
    success: boolean;
    status: number;
}

@Injectable()
export class GlobalInterceptor<T> implements NestInterceptor<T, ResponseType<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseType<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest() as Request;
        const response = ctx.getResponse() as Response;

        return next.handle().pipe(
            map(data => ({
                success: this.isSuccess(response.statusCode),
                status: response.statusCode,
                data: data || null,
                timestamp: new Date().toISOString(),
                path: request.url,
            })),
        );
    }

    private isSuccess(statusCode: number): boolean {
        return statusCode >= 200 && statusCode < 400;
    }
}
