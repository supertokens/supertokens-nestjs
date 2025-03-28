"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const session_1 = __importDefault(require("supertokens-node/recipe/session"));
const supertokens_module_1 = require("./supertokens.module");
const AppInfo = {
    appName: 'ST',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
};
const connectionUri = import.meta.env.VITE_ST_CONNECTION_URI;
(0, vitest_1.describe)('SuperTokensModule', () => {
    (0, vitest_1.beforeAll)(async () => { });
    (0, vitest_1.it)('should initialize with forRoot', async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                supertokens_module_1.SuperTokensModule.forRoot({
                    framework: 'express',
                    supertokens: {
                        connectionURI: connectionUri,
                    },
                    appInfo: AppInfo,
                    recipeList: [session_1.default.init()],
                }),
            ],
        }).compile();
        const app = moduleRef.createNestApplication();
        await app.init();
        const module = app.get(supertokens_module_1.SuperTokensModule);
        (0, vitest_1.expect)(module).toBeDefined();
        await app.close();
    });
    (0, vitest_1.it)('should initialize with forRootAsync', async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                supertokens_module_1.SuperTokensModule.forRootAsync({
                    useFactory: async () => ({
                        framework: 'express',
                        supertokens: {
                            connectionURI: connectionUri,
                        },
                        appInfo: AppInfo,
                        recipeList: [session_1.default.init()],
                    }),
                    inject: [],
                }),
            ],
        }).compile();
        const app = moduleRef.createNestApplication();
        await app.init();
        const module = app.get(supertokens_module_1.SuperTokensModule);
        (0, vitest_1.expect)(module).toBeDefined();
        await app.close();
    });
});
