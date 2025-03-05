import { OnModuleInit } from '@nestjs/common';
import { SuperTokensModuleOptions } from './supertokens.types';
export declare class SuperTokensService implements OnModuleInit {
    private options;
    constructor(options: SuperTokensModuleOptions);
    onModuleInit(): Promise<void>;
}
