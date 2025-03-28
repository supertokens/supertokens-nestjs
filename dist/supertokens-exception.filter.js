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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperTokensExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const supertokens_node_1 = require("supertokens-node");
const express_1 = require("supertokens-node/framework/express");
let SuperTokensExceptionFilter = class SuperTokensExceptionFilter {
    constructor() {
        this.handler = (0, express_1.errorHandler)();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const resp = ctx.getResponse();
        this.handler(exception, ctx.getRequest(), resp, ctx.getNext());
    }
};
exports.SuperTokensExceptionFilter = SuperTokensExceptionFilter;
exports.SuperTokensExceptionFilter = SuperTokensExceptionFilter = __decorate([
    (0, common_1.Catch)(supertokens_node_1.Error),
    __metadata("design:paramtypes", [])
], SuperTokensExceptionFilter);
