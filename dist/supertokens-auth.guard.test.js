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
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const supertest_1 = require("supertest");
const testing_1 = require("@nestjs/testing");
const session_1 = require("supertokens-node/recipe/session");
const emailpassword_1 = require("supertokens-node/recipe/emailpassword");
const userroles_1 = require("supertokens-node/recipe/userroles");
const emailverification_1 = require("supertokens-node/recipe/emailverification");
const multifactorauth_1 = require("supertokens-node/recipe/multifactorauth");
const supertokens_module_1 = require("./supertokens.module");
const supertokens_auth_guard_1 = require("./supertokens-auth.guard");
const supertokens_exception_filter_1 = require("./supertokens-exception.filter");
const core_1 = require("@nestjs/core");
const decorators_1 = require("./decorators");
const AppInfo = {
    appName: 'ST',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
};
const connectionUri = import.meta.env.VITE_ST_CONNECTION_URI;
const getSession = session_1.default.getSession;
vitest_1.vi.mock('supertokens-node/recipe/session', { spy: true });
(0, vitest_1.describe)('SuperTokensAuthGuard', () => {
    (0, vitest_1.it)('should be called on a specific route', async () => {
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
            (0, common_1.UseGuards)(supertokens_auth_guard_1.SuperTokensAuthGuard),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], TestController.prototype, "getProtected", null);
        TestController = __decorate([
            (0, common_1.Controller)()
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
        const app = moduleRef.createNestApplication();
        app.useGlobalFilters(new supertokens_exception_filter_1.SuperTokensExceptionFilter());
        await app.init();
        await app.listen(0);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/`).expect(200);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/protected`).expect(401);
        await app.close();
    });
    (0, vitest_1.it)('should be called on a specific controller', async () => {
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
        const app = moduleRef.createNestApplication();
        app.useGlobalFilters(new supertokens_exception_filter_1.SuperTokensExceptionFilter());
        await app.init();
        await app.listen(0);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/`).expect(401);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/protected`).expect(401);
        await app.close();
    });
    (0, vitest_1.it)('should be called globally', async () => {
        let FirstController = class FirstController {
            getPublic() {
                return 'protected';
            }
        };
        __decorate([
            (0, common_1.Get)('/'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], FirstController.prototype, "getPublic", null);
        FirstController = __decorate([
            (0, common_1.Controller)('/first')
        ], FirstController);
        let SecondController = class SecondController {
            getPublic() {
                return 'protected';
            }
        };
        __decorate([
            (0, common_1.Get)('/'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", String)
        ], SecondController.prototype, "getPublic", null);
        SecondController = __decorate([
            (0, common_1.Controller)('/second')
        ], SecondController);
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
            controllers: [FirstController, SecondController],
            providers: [
                {
                    provide: core_1.APP_GUARD,
                    useClass: supertokens_auth_guard_1.SuperTokensAuthGuard,
                },
            ],
        }).compile();
        const app = moduleRef.createNestApplication();
        app.useGlobalFilters(new supertokens_exception_filter_1.SuperTokensExceptionFilter());
        await app.init();
        await app.listen(0);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/first/`).expect(401);
        await (0, supertest_1.default)(app.getHttpServer()).get(`/second/`).expect(401);
        await app.close();
    });
    (0, vitest_1.describe)('Decorators', async () => {
        let app;
        let guard;
        let checkSessionDecoratorFn = vitest_1.vi.fn();
        (0, vitest_1.beforeAll)(async () => {
            let TestController = class TestController {
                getPublic() { }
                getProtected() { }
                verifySession() { }
                roles() { }
                permissions() { }
                requireEmailVerification() { }
                disableEmailVerification() { }
                requireMFA() { }
                disableMFA() { }
                sessionParams(session, userId) {
                    checkSessionDecoratorFn(session, userId);
                }
            };
            __decorate([
                (0, decorators_1.PublicAccess)(),
                (0, common_1.Get)('/'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "getPublic", null);
            __decorate([
                (0, common_1.Get)('/protected'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "getProtected", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    options: {
                        checkDatabase: true,
                    },
                }),
                (0, common_1.Get)('/verify-session'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "verifySession", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    roles: ['admin'],
                }),
                (0, common_1.Get)('/roles'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "roles", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    permissions: ['write'],
                }),
                (0, common_1.Get)('/permissions'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "permissions", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    requireEmailVerification: true,
                }),
                (0, common_1.Get)('/require-email-verification'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "requireEmailVerification", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    options: {
                        overrideGlobalClaimValidators: (globalValidators) => [
                            ...globalValidators,
                            emailverification_1.EmailVerificationClaim.validators.isVerified(),
                        ],
                    },
                    requireEmailVerification: false,
                }),
                (0, common_1.Get)('/disable-email-verification'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "disableEmailVerification", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    requireMFA: true,
                }),
                (0, common_1.Get)('/require-mfa'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "requireMFA", null);
            __decorate([
                (0, decorators_1.VerifySession)({
                    requireMFA: false,
                }),
                (0, common_1.Get)('/disable-mfa'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "disableMFA", null);
            __decorate([
                (0, common_1.Get)('/session-params'),
                __param(0, (0, decorators_1.Session)()),
                __param(1, (0, decorators_1.Session)('userId')),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Object]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "sessionParams", null);
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
            guard = moduleRef.get(supertokens_auth_guard_1.SuperTokensAuthGuard);
            app.useGlobalFilters(new supertokens_exception_filter_1.SuperTokensExceptionFilter());
            await app.init();
            await app.listen(0);
        });
        (0, vitest_1.afterAll)(async () => {
            if (app) {
                await app.close();
            }
        });
        (0, vitest_1.beforeEach)(async () => {
            getSession.mockClear();
        });
        (0, vitest_1.it)('PublicAccess', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/`).expect(200);
            await (0, supertest_1.default)(app.getHttpServer()).get(`/protected`).expect(401);
        });
        (0, vitest_1.it)('VerifySession', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/protected`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            const [, , defaultVerifySessionOptions] = getSession.mock.lastCall;
            (0, vitest_1.expect)(defaultVerifySessionOptions.checkDatabase).toBeUndefined();
            await (0, supertest_1.default)(app.getHttpServer()).get(`/verify-session`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(2);
            const [, , customVerifySessionOptions] = getSession.mock.lastCall;
            (0, vitest_1.expect)(customVerifySessionOptions.checkDatabase).toBeTruthy();
        });
        (0, vitest_1.it)('Auth[roles]', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/roles`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            const [, , verifySessionOptions] = getSession.mock.lastCall;
            const actualValidators = await verifySessionOptions.overrideGlobalClaimValidators([]);
            const expectedValidators = [
                userroles_1.default.UserRoleClaim.validators.includesAll(['admin']),
            ];
            for (const [index, validator] of actualValidators.entries()) {
                (0, vitest_1.expect)(validator.id).toBe(expectedValidators[index].id);
            }
        });
        (0, vitest_1.it)('Auth[permissions]', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/permissions`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            const [, , verifySessionOptions] = getSession.mock.lastCall;
            const actualValidators = await verifySessionOptions.overrideGlobalClaimValidators([]);
            const expectedValidators = [
                userroles_1.default.PermissionClaim.validators.includesAll(['write']),
            ];
            for (const [index, validator] of actualValidators.entries()) {
                (0, vitest_1.expect)(validator.id).toBe(expectedValidators[index].id);
            }
        });
        (0, vitest_1.it)('Auth[requireEmailVerification]', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/require-email-verification`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            const [, , requireEvVerifySessionOptions] = getSession.mock.lastCall;
            const actualValidators = await requireEvVerifySessionOptions.overrideGlobalClaimValidators([]);
            const expectedValidators = [
                emailverification_1.EmailVerificationClaim.validators.isVerified(),
            ];
            for (const [index, validator] of actualValidators.entries()) {
                (0, vitest_1.expect)(validator.id).toBe(expectedValidators[index].id);
            }
            await (0, supertest_1.default)(app.getHttpServer()).get(`/disable-email-verification`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(2);
            const [, , disableEvVerifySessionOptions] = getSession.mock.lastCall;
            const disableEvValidators = await disableEvVerifySessionOptions.overrideGlobalClaimValidators([]);
            (0, vitest_1.expect)(disableEvValidators).toEqual([]);
        });
        (0, vitest_1.it)('Auth[requireMFA]', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get(`/require-mfa`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            const [, , verifySessionOptions] = getSession.mock.lastCall;
            const actualValidators = await verifySessionOptions.overrideGlobalClaimValidators([]);
            const expectedValidators = [
                multifactorauth_1.MultiFactorAuthClaim.validators.hasCompletedMFARequirementsForAuth(),
            ];
            for (const [index, validator] of actualValidators.entries()) {
                (0, vitest_1.expect)(validator.id).toBe(expectedValidators[index].id);
            }
        });
        (0, vitest_1.it)('Session', async () => {
            const userId = 'userId';
            const mockSession = {
                getUserId: () => userId,
            };
            getSession.mockImplementationOnce(() => mockSession);
            await (0, supertest_1.default)(app.getHttpServer()).get(`/session-params`);
            (0, vitest_1.expect)(getSession).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(checkSessionDecoratorFn).toHaveBeenCalledWith(mockSession, userId);
        });
    });
});
