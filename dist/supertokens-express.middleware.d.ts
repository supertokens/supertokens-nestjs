import { NestMiddleware } from "@nestjs/common";
import { middleware } from "supertokens-node/framework/express";
export declare class SuperTokensExpressAuthMiddleware implements NestMiddleware {
    middleware: ReturnType<typeof middleware>;
    constructor();
    use(req: Request, res: any, next: () => void): Promise<void>;
}
