import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class SuperTokensFastifyExceptionFilter implements ExceptionFilter {
    private handler;
    constructor();
    catch(exception: Error, host: ArgumentsHost): void;
}
