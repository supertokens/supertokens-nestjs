import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import UserRoles from 'supertokens-node/recipe/userroles'
import {
  getSession,
  SessionClaimValidator,
  VerifySessionOptions,
} from 'supertokens-node/recipe/session'
import { EmailVerificationClaim } from 'supertokens-node/recipe/emailverification'
import { MultiFactorAuthClaim } from 'supertokens-node/recipe/multifactorauth'
import { VerifySession, PublicAccess, Auth } from './decorators'
import { AuthDecoratorOptions } from './supertokens.types'

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private reflector: Reflector
  constructor() {
    this.reflector = new Reflector()
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(PublicAccess, context.getHandler())
    if (isPublic) return true

    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    const resp = ctx.getResponse()

    const verifySessionOptions = this.getVerifySessionOptions(context)

    const session = await getSession(req, resp, verifySessionOptions)
    req.session = session
    return true
  }

  private getVerifySessionOptions(
    context: ExecutionContext,
  ): VerifySessionOptions | undefined {
    const verifySessionOptions: VerifySessionOptions | undefined =
      this.reflector.get(VerifySession, context.getHandler())
    const authOptions: AuthDecoratorOptions | undefined = this.reflector.get(
      Auth,
      context.getHandler(),
    )
    const extraClaimValidators: SessionClaimValidator[] = []
    const validatorsToRemove: string[] = []

    if (authOptions?.roles) {
      extraClaimValidators.push(
        UserRoles.UserRoleClaim.validators.includesAll(authOptions.roles),
      )
    }

    if (authOptions?.permissions) {
      extraClaimValidators.push(
        UserRoles.PermissionClaim.validators.includesAll(
          authOptions.permissions,
        ),
      )
    }

    if (authOptions?.requireEmailVerification) {
      extraClaimValidators.push(EmailVerificationClaim.validators.isVerified())
    } else if (authOptions?.requireEmailVerification === false) {
      validatorsToRemove.push(EmailVerificationClaim.key)
    }

    if (authOptions?.requireMFA) {
      extraClaimValidators.push(
        MultiFactorAuthClaim.validators.hasCompletedMFARequirementsForAuth(),
      )
    } else if (authOptions?.requireMFA === false) {
      validatorsToRemove.push(MultiFactorAuthClaim.key)
    }

    const overrideGlobalClaimValidators = async (
      globalValidators: SessionClaimValidator[],
    ) => {
      let parsedValidators = [...globalValidators]
      if (validatorsToRemove.length) {
        parsedValidators = parsedValidators.filter(
          (validator) => !validatorsToRemove.includes(validator.id),
        )
      }
      return [...parsedValidators, ...extraClaimValidators]
    }

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
