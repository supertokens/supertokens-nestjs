import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import UserRoles from "supertokens-node/recipe/userroles"
import {
  getSession,
  VerifySessionOptions,
} from "supertokens-node/recipe/session"
import { Error as STError } from "supertokens-node/recipe/session"

import { Permissions, PublicRoute, Roles, SessionOptions } from "./decorators"
import { SuperTokensSession } from "./supertokens.types"

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private reflector: Reflector
  constructor() {
    this.reflector = new Reflector()
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: Exclude supertokens routes if the guard is applied globally
    const isPublic = this.reflector.get(PublicRoute, context.getHandler())

    if (isPublic) return true

    const options = this.reflector.get(SessionOptions, context.getHandler())
    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    const resp = ctx.getResponse()

    // TODO: Email verification options
    const parsedOptions = {}
    const session = await getSession(req, resp, options)
    req.session = session

    const roles = this.reflector.get(Roles, context.getHandler())
    if (roles) {
      await this.validateRoles(session, roles)
    }

    const permissions = this.reflector.get(Permissions, context.getHandler())
    if (permissions) {
      await this.validatePermissions(session, permissions)
    }

    return true
  }

  private async validateRoles(
    session: SuperTokensSession,
    requiredRoles: string[],
  ) {
    const roles = await session!.getClaimValue(UserRoles.UserRoleClaim)
    if (!roles) {
      this.throwRolesError()
    }

    const hasRoles = requiredRoles.every((requiredScope) =>
      roles.includes(requiredScope),
    )
    if (!hasRoles) {
      this.throwRolesError()
    }
  }

  private async validatePermissions(
    session: SuperTokensSession,
    requiredPermissions: string[],
  ) {
    const permissions = await session!.getClaimValue(UserRoles.PermissionClaim)
    if (!permissions) {
      this.throwPermissionsError()
    }

    const hasPermissions = requiredPermissions.every((requiredScope) =>
      permissions.includes(requiredScope),
    )
    if (!hasPermissions) {
      this.throwPermissionsError()
    }
  }

  private throwRolesError() {
    // TODO: Allow users to customize this error
    throw new STError({
      type: "INVALID_CLAIMS",
      message: "User does not have the required roles",
      payload: [
        {
          id: UserRoles.UserRoleClaim.key,
        },
      ],
    })
  }

  private throwPermissionsError() {
    // TODO: Allow users to customize this error
    throw new STError({
      type: "INVALID_CLAIMS",
      message: "User does not have the required permissions",
      payload: [
        {
          id: UserRoles.UserRoleClaim.key,
        },
      ],
    })
  }
}
