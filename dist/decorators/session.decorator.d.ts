type SessionPropertyName = 'userId' | 'tenantId' | 'accessToken' | 'accessTokenPayload';
export declare const Session: (...dataOrPipes: (SessionPropertyName | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export {};
