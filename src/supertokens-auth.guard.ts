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
import { VerifySession, PublicAccess } from './decorators'
import { ContextDataExtractor } from './supertokens.types'

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private reflector: Reflector
  private customCtxDataExtractor?: ContextDataExtractor

  constructor(extractDataFromConext?: ContextDataExtractor) {
    this.reflector = new Reflector()
    this.customCtxDataExtractor = extractDataFromConext
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(PublicAccess, context.getHandler())

    if (isPublic) return true

    const { request, response } = this.extractDataFromContext(context)
    const verifySessionOptions = this.getVerifySessionOptions(context)

    const session = await getSession(request, response, verifySessionOptions)

    request.session = session
    return true
  }

  private extractDataFromContext(context: ExecutionContext) {
    if (this.customCtxDataExtractor) {
      return this.customCtxDataExtractor(context)
    }
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    return { request, response }
  }

  private getVerifySessionOptions(
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
