import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common'
import { ContextDataExtractor } from './supertokens.types'
import { SuperTokensSessionVerifier } from './supertokens-session.verifier'

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  private readonly sessionVerifier: SuperTokensSessionVerifier

  constructor(extractDataFromContext?: ContextDataExtractor)
  constructor(
    sessionVerifier?: SuperTokensSessionVerifier,
    extractDataFromContext?: ContextDataExtractor,
  )
  constructor(
    @Optional()
    @Inject(SuperTokensSessionVerifier)
    sessionVerifierOrExtractDataFromContext?:
      | SuperTokensSessionVerifier
      | ContextDataExtractor,
    extractDataFromContext?: ContextDataExtractor,
  ) {
    if (typeof sessionVerifierOrExtractDataFromContext === 'function') {
      this.sessionVerifier = new SuperTokensSessionVerifier(
        sessionVerifierOrExtractDataFromContext,
      )
      return
    }

    this.sessionVerifier =
      sessionVerifierOrExtractDataFromContext ??
      new SuperTokensSessionVerifier(extractDataFromContext)
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.sessionVerifier.isPublic(context)) return true

    return this.sessionVerifier.verifySession(context)
  }
}
