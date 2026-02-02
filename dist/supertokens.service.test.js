"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fastify_1 = require("supertokens-node/framework/fastify");
const supertokens_service_1 = require("./supertokens.service");
vitest_1.vi.mock('supertokens-node', () => ({
    default: {
        init: vitest_1.vi.fn(),
    },
}));
const AppInfo = {
    appName: 'ST',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
};
const connectionUri = process.env.VITE_ST_CONNECTION_URI || 'http://localhost:4356';
(0, vitest_1.describe)('SuperTokensService', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should throw when fastifyAdapter is missing', async () => {
        const service = new supertokens_service_1.SuperTokensService({
            framework: 'fastify',
            supertokens: {
                connectionURI: connectionUri,
            },
            appInfo: AppInfo,
            recipeList: [],
        });
        await (0, vitest_1.expect)(service.onModuleInit()).rejects.toThrow('fastifyAdapter is required when using fastify as a framework');
    });
    (0, vitest_1.it)('should register the fastify plugin when adapter is provided', async () => {
        const register = vitest_1.vi.fn();
        const service = new supertokens_service_1.SuperTokensService({
            framework: 'fastify',
            fastifyAdapter: { register },
            supertokens: {
                connectionURI: connectionUri,
            },
            appInfo: AppInfo,
            recipeList: [],
        });
        await service.onModuleInit();
        (0, vitest_1.expect)(register).toHaveBeenCalledWith(fastify_1.plugin);
    });
});
