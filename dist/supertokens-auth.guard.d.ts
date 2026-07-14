import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ContextDataExtractor } from './supertokens.types';
import { SuperTokensSessionVerifier } from './supertokens-session.verifier';
export declare class SuperTokensAuthGuard implements CanActivate {
    private readonly sessionVerifier;
    constructor(extractDataFromContext?: ContextDataExtractor);
    constructor(sessionVerifier?: SuperTokensSessionVerifier, extractDataFromContext?: ContextDataExtractor);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
