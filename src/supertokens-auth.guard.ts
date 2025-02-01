import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import UserRoles from "supertokens-node/recipe/userroles"
import {
  getSession,
  SessionClaimValidator,
  VerifySessionOptions,
} from "supertokens-node/recipe/session"
import { Error as STError } from "supertokens-node/recipe/session"

import { EmailVerificationClaim } from "supertokens-node/recipe/emailverification"
import { MultiFactorAuthClaim } from "supertokens-node/recipe/multifactorauth"
import { VerifySession, PublicAccess, Auth } from "./decorators"
import { AuthDecoratorOptions, SuperTokensSession } from "./supertokens.types"
import { JSONValue } from "supertokens-node/types"

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private reflector: Reflector
  constructor() {
    this.reflector = new Reflector()
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: Exclude supertokens routes if the guard is applied globally
    const isPublic = this.reflector.get(PublicAccess, context.getHandler())

    if (isPublic) return true

    const verifySessionOptions: VerifySessionOptions | undefined =
      this.reflector.get(VerifySession, context.getHandler())
    const authOptions: AuthDecoratorOptions | undefined = this.reflector.get(
      Auth,
      context.getHandler(),
    )
    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    const resp = ctx.getResponse()

    let parsedVerifySessionOptions = verifySessionOptions
    parsedVerifySessionOptions = this.addEmailVerificationToSessionOptions(
      authOptions?.requireEmailVerification,
      verifySessionOptions,
    )
    parsedVerifySessionOptions = this.removeMFAFromSessionOptions(
      authOptions?.requireMFA,
      verifySessionOptions,
    )

    const session = await getSession(req, resp, parsedVerifySessionOptions)
    req.session = session

    await this.validateRoles(session, authOptions?.roles)
    await this.validatePermissions(session, authOptions?.permissions)
    await this.validateMFA(session, authOptions?.requireMFA)

    return true
  }

  private async validateRoles(
    session: SuperTokensSession,
    requiredRoles: string[] | undefined,
  ) {
    if (!requiredRoles) return
    const roles = await session!.getClaimValue(UserRoles.UserRoleClaim)
    if (!roles) {
      throw new STClaimError(
        UserRoles.UserRoleClaim.key,
        "User does not have the required roles",
        "Required roles not found",
      )
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
    requiredPermissions: string[] | undefined,
  ) {
    if (!requiredPermissions) return
    const permissions = await session!.getClaimValue(UserRoles.PermissionClaim)
    if (!permissions) {
      throw new STClaimError(
        UserRoles.PermissionClaim.key,
        "User does not have the required permissions",
        "Required permissions not found",
      )
    }

    const hasPermissions = requiredPermissions.every((requiredScope) =>
      permissions.includes(requiredScope),
    )
    if (!hasPermissions) {
      throw new STClaimError(
        UserRoles.PermissionClaim.key,
        "User does not have the required permissions",
        "Required permissions not found",
      )
    }
  }

  private async validateMFA(
    session: SuperTokensSession,
    requiresMFA: boolean | undefined,
  ) {
    if (!requiresMFA) return
    let claimValue = await session!.getClaimValue(MultiFactorAuthClaim)
    if (claimValue === undefined) {
      await session!.fetchAndSetClaim(MultiFactorAuthClaim)
      claimValue = (await session!.getClaimValue(MultiFactorAuthClaim))!
    }

    let completedFactors = claimValue.c
    if ("totp" in completedFactors) {
      return
    } else {
      throw new STClaimError(
        MultiFactorAuthClaim.key,
        "User has not finished TOTP",
        {
          message: "Factor validation failed: totp not completed",
          factorId: "totp",
        },
      )
    }
  }

  private removeMFAFromSessionOptions(
    requiresMFA: boolean | undefined,
    verifySessionOptions: VerifySessionOptions,
  ): VerifySessionOptions {
    if (requiresMFA === undefined) return verifySessionOptions

    const overrideGlobalClaimValidators = disableMFAValidator

    if (!verifySessionOptions) {
      return {
        overrideGlobalClaimValidators,
      }
    }

    if (verifySessionOptions.overrideGlobalClaimValidators) {
      return {
        overrideGlobalClaimValidators: async (
          globalValidators,
          session,
          userContext,
        ) => {
          const baseValidators: SessionClaimValidator[] =
            await verifySessionOptions.overrideGlobalClaimValidators(
              globalValidators,
              session,
              userContext,
            )
          return overrideGlobalClaimValidators(baseValidators)
        },
      }
    }
    return {
      ...verifySessionOptions,
      overrideGlobalClaimValidators,
    }
  }

  private addEmailVerificationToSessionOptions(
    requiresEmailVerification: boolean | undefined,
    verifySessionOptions: VerifySessionOptions,
  ): VerifySessionOptions {
    if (requiresEmailVerification === undefined) return verifySessionOptions

    const overrideGlobalClaimValidators = requiresEmailVerification
      ? requireEmailVerificationValidator
      : disableEmailVerificationValidator

    if (!verifySessionOptions) {
      return {
        overrideGlobalClaimValidators,
      }
    }

    if (verifySessionOptions.overrideGlobalClaimValidators) {
      return {
        overrideGlobalClaimValidators: async (
          globalValidators,
          session,
          userContext,
        ) => {
          const baseValidators: SessionClaimValidator[] =
            await verifySessionOptions.overrideGlobalClaimValidators(
              globalValidators,
              session,
              userContext,
            )
          return overrideGlobalClaimValidators(baseValidators)
        },
      }
    }
    return {
      ...verifySessionOptions,
      overrideGlobalClaimValidators,
    }
  }
}

async function requireEmailVerificationValidator(
  globalValidators: SessionClaimValidator[],
) {
  return [...globalValidators, EmailVerificationClaim.validators.isVerified()]
}

async function disableEmailVerificationValidator(
  globalValidators: SessionClaimValidator[],
) {
  return globalValidators.filter((v) => v.id !== EmailVerificationClaim.key)
}

async function disableMFAValidator(globalValidators: SessionClaimValidator[]) {
  return globalValidators.filter((v) => v.id !== MultiFactorAuthClaim.key)
}

class STClaimError extends STError {
  constructor(id: string, message: string, reason: JSONValue) {
    super({
      type: STError.INVALID_CLAIMS,
      message,
      payload: [
        {
          id,
          reason,
        },
      ],
    })
  }
}
