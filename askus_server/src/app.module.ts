import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IS_DEV } from "./libs/common/utils/is-dev.util";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV,
            isGlobal: true,
        }),
    ],
})

export class AppModule {}
