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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const supertest_1 = require("supertest");
const testing_1 = require("@nestjs/testing");
const session_1 = require("supertokens-node/recipe/session");
const emailpassword_1 = require("supertokens-node/recipe/emailpassword");
const supertokens_module_1 = require("./supertokens.module");
const supertokens_auth_guard_1 = require("./supertokens-auth.guard");
const supertokens_exception_filter_1 = require("./supertokens-exception.filter");
const AppInfo = {
    appName: 'ST',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
};
const connectionUri = import.meta.env.VITE_ST_CONNECTION_URI;
(0, vitest_1.describe)('SuperTokensExceptionFilter', () => {
    let app;
    let exceptionFilter;
    (0, vitest_1.beforeAll)(async () => {
        let TestController = class TestController {
            getPublic() {
                return 'public';
            }
            getProtected() {
                return 'protected';
            }
        };
        __decorate([
            (0, common_1.Get)('/'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], TestController.prototype, "getPublic", null);
        __decorate([
            (0, common_1.Get)('/protected'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], TestController.prototype, "getProtected", null);
        TestController = __decorate([
            (0, common_1.Controller)(),
            (0, common_1.UseGuards)(supertokens_auth_guard_1.SuperTokensAuthGuard)
        ], TestController);
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                supertokens_module_1.SuperTokensModule.forRoot({
                    framework: 'express',
                    supertokens: {
                        connectionURI: connectionUri,
                    },
                    appInfo: AppInfo,
                    recipeList: [session_1.default.init(), emailpassword_1.default.init()],
                }),
            ],
            controllers: [TestController],
        }).compile();
        app = moduleRef.createNestApplication();
        exceptionFilter = new supertokens_exception_filter_1.SuperTokensExceptionFilter();
        app.useGlobalFilters(exceptionFilter);
        await app.init();
        await app.listen(0);
    });
    (0, vitest_1.it)('should catch authentication errors', async () => {
        const spy = vitest_1.vi.spyOn(exceptionFilter, 'handler');
        (0, vitest_1.expect)(spy).not.toHaveBeenCalled();
        await (0, supertest_1.default)(app.getHttpServer()).get(`/`);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/protected`);
        (0, vitest_1.expect)(spy).toHaveBeenCalled();
    });
});
