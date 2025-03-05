import { MiddlewareConsumer, DynamicModule } from "@nestjs/common";
import { SuperTokensModuleOptions, SuperTokensModuleAsyncOptions } from "./supertokens.types";
export declare class SuperTokensModule {
    private options;
    constructor(options: SuperTokensModuleOptions);
    configure(consumer: MiddlewareConsumer): void;
    static forRoot(options: SuperTokensModuleOptions & {
        global?: boolean;
    }): DynamicModule;
    static forRootAsync(options: SuperTokensModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
