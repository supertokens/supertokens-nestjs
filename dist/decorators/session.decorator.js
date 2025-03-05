"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const common_1 = require("@nestjs/common");
exports.Session = (0, common_1.createParamDecorator)((propName, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;
    if (!propName)
        return session;
    if (!session) {
        throw new Error(`Session does not exist`);
    }
    const propNameCapitalized = propName.charAt(0).toUpperCase() + propName.slice(1);
    const getterName = `get${propNameCapitalized}`;
    if (!session[getterName]) {
        throw new Error(`Session property ${propName} does not exist`);
    }
    return session[getterName]();
});
