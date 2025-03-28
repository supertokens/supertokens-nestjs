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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const userroles_1 = __importDefault(require("supertokens-node/recipe/userroles"));
const session_1 = require("supertokens-node/recipe/session");
const emailverification_1 = require("supertokens-node/recipe/emailverification");
const multifactorauth_1 = require("supertokens-node/recipe/multifactorauth");
const decorators_1 = require("./decorators");
let SuperTokensAuthGuard = class SuperTokensAuthGuard {
    constructor(extractDataFromConext) {
        this.reflector = new core_1.Reflector();
        this.customCtxDataExtractor = extractDataFromConext;
    }
    async canActivate(context) {
        const isPublic = this.reflector.get(decorators_1.PublicAccess, context.getHandler());
        if (isPublic)
            return true;
        const { request, response } = this.extractDataFromContext(context);
        const verifySessionOptions = this.getVerifySessionOptions(context);
        const session = await (0, session_1.getSession)(request, response, verifySessionOptions);
        request.session = session;
        return true;
    }
    extractDataFromContext(context) {
        if (this.customCtxDataExtractor) {
            return this.customCtxDataExtractor(context);
        }
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        return { request, response };
    }
    getVerifySessionOptions(context) {
        const verifySessionDecoratorOptions = this.reflector.get(decorators_1.VerifySession, context.getHandler());
        const { roles, permissions, requireEmailVerification, requireMFA, options: verifySessionOptions, } = verifySessionDecoratorOptions || {};
        const extraClaimValidators = [];
        const validatorsToRemove = [];
        if (roles) {
            extraClaimValidators.push(userroles_1.default.UserRoleClaim.validators.includesAll(roles));
        }
        if (permissions) {
            extraClaimValidators.push(userroles_1.default.PermissionClaim.validators.includesAll(permissions));
        }
        if (requireEmailVerification) {
            extraClaimValidators.push(emailverification_1.EmailVerificationClaim.validators.isVerified());
        }
        else if (requireEmailVerification === false) {
            validatorsToRemove.push(emailverification_1.EmailVerificationClaim.key);
        }
        if (requireMFA) {
            extraClaimValidators.push(multifactorauth_1.MultiFactorAuthClaim.validators.hasCompletedMFARequirementsForAuth());
        }
        else if (requireMFA === false) {
            validatorsToRemove.push(multifactorauth_1.MultiFactorAuthClaim.key);
        }
        const overrideGlobalClaimValidators = async (globalValidators) => {
            let parsedValidators = [...globalValidators];
            if (validatorsToRemove.length) {
                parsedValidators = parsedValidators.filter((validator) => !validatorsToRemove.includes(validator.id));
            }
            return [...parsedValidators, ...extraClaimValidators];
        };
        if (!verifySessionOptions) {
            return {
                overrideGlobalClaimValidators,
            };
        }
        if (verifySessionOptions.overrideGlobalClaimValidators) {
            return {
                overrideGlobalClaimValidators: async (globalValidators, session, userContext) => {
                    const baseValidators = await verifySessionOptions.overrideGlobalClaimValidators(globalValidators, session, userContext);
                    return overrideGlobalClaimValidators(baseValidators);
                },
            };
        }
        return {
            ...verifySessionOptions,
            overrideGlobalClaimValidators,
        };
    }
};
exports.SuperTokensAuthGuard = SuperTokensAuthGuard;
exports.SuperTokensAuthGuard = SuperTokensAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], SuperTokensAuthGuard);
