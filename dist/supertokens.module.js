"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SuperTokensModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensModule = void 0;
const common_1 = require("@nestjs/common");
const supertokens_express_middleware_1 = require("./supertokens-express.middleware");
const supertokens_constants_1 = require("./supertokens.constants");
const supertokens_service_1 = require("./supertokens.service");
let SuperTokensModule = SuperTokensModule_1 = class SuperTokensModule {
    constructor(options) {
        this.options = options;
    }
    configure(consumer) {
        if (this.options.framework !== "express")
            return;
        consumer.apply(supertokens_express_middleware_1.SuperTokensExpressAuthMiddleware).forRoutes("*");
    }
    static forRoot(options) {
        const { global = true } = options;
        return {
            module: SuperTokensModule_1,
            global,
            providers: [
                {
                    useValue: options,
                    provide: supertokens_constants_1.SUPERTOKENS_MODULE_OPTIONS,
                },
                supertokens_service_1.SuperTokensService,
            ],
        };
    }
    static forRootAsync(options) {
        const { global = true } = options;
        return {
            module: SuperTokensModule_1,
            global,
            imports: options.imports || [],
            providers: [...this.createAsyncProviders(options)],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        if (options.useClass) {
            return [
                this.createAsyncOptionsProvider(options),
                {
                    provide: options.useClass,
                    useClass: options.useClass,
                },
            ];
        }
        throw new Error("Invalid configuration options");
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: supertokens_constants_1.SUPERTOKENS_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        if (options.useExisting) {
            return {
                provide: supertokens_constants_1.SUPERTOKENS_MODULE_OPTIONS,
                useFactory: async (optionsFactory) => await optionsFactory.createSuperTokensModuleOptions(),
                inject: [options.useExisting],
            };
        }
        throw new Error("Invalid configuration options");
    }
};
exports.SuperTokensModule = SuperTokensModule;
exports.SuperTokensModule = SuperTokensModule = SuperTokensModule_1 = __decorate([
    (0, common_1.Module)({
        providers: [supertokens_service_1.SuperTokensService],
        exports: [],
        controllers: [],
    }),
    __param(0, (0, common_1.Inject)(supertokens_constants_1.SUPERTOKENS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SuperTokensModule);
