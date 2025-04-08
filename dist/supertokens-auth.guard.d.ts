import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ContextDataExtractor } from './supertokens.types';
export declare class SuperTokensAuthGuard implements CanActivate {
    private reflector;
    private customCtxDataExtractor?;
    constructor(extractDataFromConext?: ContextDataExtractor);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractDataFromContext;
    private getVerifySessionOptions;
}
