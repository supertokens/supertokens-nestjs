import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { errorHandler } from 'supertokens-node/framework/express';
export declare class SuperTokensExceptionFilter implements ExceptionFilter {
    handler: ReturnType<typeof errorHandler>;
    constructor();
    catch(exception: Error, host: ArgumentsHost): void;
}
