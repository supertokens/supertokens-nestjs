"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensService = void 0;
const common_1 = require("@nestjs/common");
const supertokens_node_1 = require("supertokens-node");
const supertokens_constants_1 = require("./supertokens.constants");
const fastify_1 = require("supertokens-node/framework/fastify");
let SuperTokensService = class SuperTokensService {
    constructor(options) {
        this.options = options;
        supertokens_node_1.default.init(this.options);
    }
    async onModuleInit() {
        if (this.options.framework === 'fastify') {
            if (!this.options.fastifyAdapter)
                throw new Error('fastifyAdapter is required when using fastify as a framework');
            await this.options.fastifyAdapter.register(fastify_1.plugin);
        }
    }
};
exports.SuperTokensService = SuperTokensService;
exports.SuperTokensService = SuperTokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supertokens_constants_1.SUPERTOKENS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SuperTokensService);
