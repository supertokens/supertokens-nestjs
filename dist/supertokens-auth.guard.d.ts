import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SuperTokensAuthGuard implements CanActivate {
    private reflector;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getVerifySessionOptions;
}
