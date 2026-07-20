import { ExecutionContext } from '@nestjs/common';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { ContextDataExtractor } from './supertokens.types';
export declare class SuperTokensSessionVerifier {
    private readonly customCtxDataExtractor?;
    private readonly reflector;
    constructor(customCtxDataExtractor?: ContextDataExtractor);
    isPublic(context: ExecutionContext): boolean;
    verifySession(context: ExecutionContext): Promise<boolean>;
    extractDataFromContext(context: ExecutionContext): {
        request: any;
        response: any;
    };
    getVerifySessionOptions(context: ExecutionContext): VerifySessionOptions | undefined;
}
