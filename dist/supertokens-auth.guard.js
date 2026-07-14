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
exports.SuperTokensAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const supertokens_session_verifier_1 = require("./supertokens-session.verifier");
let SuperTokensAuthGuard = class SuperTokensAuthGuard {
    constructor(sessionVerifierOrExtractDataFromContext, extractDataFromContext) {
        if (typeof sessionVerifierOrExtractDataFromContext === 'function') {
            this.sessionVerifier = new supertokens_session_verifier_1.SuperTokensSessionVerifier(sessionVerifierOrExtractDataFromContext);
            return;
        }
        this.sessionVerifier =
            sessionVerifierOrExtractDataFromContext ??
                new supertokens_session_verifier_1.SuperTokensSessionVerifier(extractDataFromContext);
    }
    async canActivate(context) {
        if (this.sessionVerifier.isPublic(context))
            return true;
        return this.sessionVerifier.verifySession(context);
    }
};
exports.SuperTokensAuthGuard = SuperTokensAuthGuard;
exports.SuperTokensAuthGuard = SuperTokensAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(supertokens_session_verifier_1.SuperTokensSessionVerifier)),
    __metadata("design:paramtypes", [Object, Function])
], SuperTokensAuthGuard);
