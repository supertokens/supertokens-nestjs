import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import UserRoles from "supertokens-node/recipe/userroles"
import { getSession } from "supertokens-node/recipe/session"
import { Error as STError } from "supertokens-node/recipe/session"

import { VerifySession, PublicAccess, Auth } from "./decorators"
import { SuperTokensSession } from "./supertokens.types"

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private reflector: Reflector
  constructor() {
    this.reflector = new Reflector()
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: Exclude supertokens routes if the guard is applied globally
    console.log("guard called...")

    const isPublic = this.reflector.get(PublicAccess, context.getHandler())

    if (isPublic) return true

    const verifySessionOptions = this.reflector.get(
      VerifySession,
      context.getHandler(),
    )
    const authOptions = this.reflector.get(Auth, context.getHandler())
    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    const resp = ctx.getResponse()

    // TODO: Email verification options
    const parsedOptions = {}
    const session = await getSession(req, resp, verifySessionOptions)
    req.session = session

    const requiredRoles = authOptions?.roles
    if (requiredRoles) {
      await this.validateRoles(session, requiredRoles)
    }

    const requiredPermissions = authOptions?.permissions
    if (requiredPermissions) {
      await this.validatePermissions(session, requiredPermissions)
    }

    return true
  }

  private async validateRoles(
    session: SuperTokensSession,
    requiredRoles: string[],
  ) {
    const roles = await session!.getClaimValue(UserRoles.UserRoleClaim)
    if (!roles) {
      // TODO: Validate if the error handling can be customized from the `errorHandlers` config
      throw new STError({
        type: STError.INVALID_CLAIMS,
        message: "User does not have the required roles",
        payload: [
          {
            id: UserRoles.PermissionClaim.key,
            reason: "Required roles not found",
          },
        ],
      })
    }

    const hasRoles = requiredRoles.every((requiredScope) =>
      roles.includes(requiredScope),
    )
    if (!hasRoles) {
      throw new STError({
        type: STError.INVALID_CLAIMS,
        message: "User does not have the required roles",
        payload: [
          {
            id: UserRoles.PermissionClaim.key,
            reason: "Required roles not found",
          },
        ],
      })
    }
  }

  private async validatePermissions(
    session: SuperTokensSession,
    requiredPermissions: string[],
  ) {
    const permissions = await session!.getClaimValue(UserRoles.PermissionClaim)
    if (!permissions) {
      throw new STError({
        type: STError.INVALID_CLAIMS,
        message: "User does not have the required permissions",
        payload: [
          {
            id: UserRoles.PermissionClaim.key,
            reason: "Required permissions not found",
          },
        ],
      })
    }

    const hasPermissions = requiredPermissions.every((requiredScope) =>
      permissions.includes(requiredScope),
    )
    if (!hasPermissions) {
      throw new STError({
        type: STError.INVALID_CLAIMS,
        message: "User does not have the required permissions",
        payload: [
          {
            id: UserRoles.PermissionClaim.key,
            reason: "Required permissions not found",
          },
        ],
      })
    }
  }
}
