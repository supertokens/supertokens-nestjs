import { NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';
type Middleware = ReturnType<typeof middleware>;
type MiddlewareRequest = Parameters<Middleware>[0];
export declare class SuperTokensExpressAuthMiddleware implements NestMiddleware {
    middleware: Middleware;
    constructor();
    use(req: MiddlewareRequest, res: any, next: () => void): Promise<void>;
}
export {};
