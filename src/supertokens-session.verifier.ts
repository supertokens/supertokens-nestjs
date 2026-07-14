import { ExecutionContext, Injectable, Optional } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EmailVerificationClaim } from 'supertokens-node/recipe/emailverification'
import { MultiFactorAuthClaim } from 'supertokens-node/recipe/multifactorauth'
import {
  getSession,
  SessionClaimValidator,
  VerifySessionOptions,
} from 'supertokens-node/recipe/session'
import UserRoles from 'supertokens-node/recipe/userroles'
import { PublicAccess, VerifySession } from './decorators'
import { ContextDataExtractor } from './supertokens.types'

@Injectable()
export class SuperTokensSessionVerifier {
  private readonly reflector: Reflector

  constructor(
    @Optional() private readonly customCtxDataExtractor?: ContextDataExtractor,
  ) {
    this.reflector = new Reflector()
  }

  public isPublic(context: ExecutionContext): boolean {
    return Boolean(
      this.reflector.getAllAndOverride(PublicAccess, [
        context.getHandler(),
        context.getClass(),
      ]),
    )
  }

  public async verifySession(context: ExecutionContext): Promise<boolean> {
    const { request, response } = this.extractDataFromContext(context)
    const verifySessionOptions = this.getVerifySessionOptions(context)

    const session = await getSession(request, response, verifySessionOptions)

    request.session = session
    return true
  }

  public extractDataFromContext(context: ExecutionContext) {
    if (this.customCtxDataExtractor) {
      return this.customCtxDataExtractor(context)
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    return { request, response }
  }

  public getVerifySessionOptions(
    context: ExecutionContext,
  ): VerifySessionOptions | undefined {
    const verifySessionDecoratorOptions = this.reflector.get(
      VerifySession,
      context.getHandler(),
    )

    const {
      roles,
      permissions,
      requireEmailVerification,
      requireMFA,
      options: verifySessionOptions,
    } = verifySessionDecoratorOptions || {}
    const extraClaimValidators: SessionClaimValidator[] = []
    const validatorsToRemove: string[] = []

    if (roles) {
      extraClaimValidators.push(
        UserRoles.UserRoleClaim.validators.includesAll(roles),
      )
    }

    if (permissions) {
      extraClaimValidators.push(
        UserRoles.PermissionClaim.validators.includesAll(permissions),
      )
    }

    if (requireEmailVerification) {
      extraClaimValidators.push(EmailVerificationClaim.validators.isVerified())
    } else if (requireEmailVerification === false) {
      validatorsToRemove.push(EmailVerificationClaim.key)
    }

    if (requireMFA) {
      extraClaimValidators.push(
        MultiFactorAuthClaim.validators.hasCompletedMFARequirementsForAuth(),
      )
    } else if (requireMFA === false) {
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
