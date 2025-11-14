import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { CustomLogger } from "./libs/common/logger/logger.service";
import { GlobalFilter } from "./libs/common/filters/global.filter";
import { GlobalInterceptor } from "./libs/common/interceptors/global.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));
    app.useLogger(new CustomLogger());
    app.useGlobalFilters(new GlobalFilter());
    app.useGlobalInterceptors(new GlobalInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.enableCors({
        origin: config.getOrThrow<string>("CLIENT_ORIGIN"),
        credentails: true,
        exposedHeaders: ["set-cookie"]
    });

    await app.listen(config.getOrThrow<string>("APPLICATION_PORT"));
}

bootstrap();
