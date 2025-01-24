import { Inject, Injectable, OnModuleInit } from "@nestjs/common"
import supertokens from "supertokens-node"
import { SUPERTOKENS_MODULE_OPTIONS } from "./supertokens.constants"
import { SuperTokensModuleOptions } from "./supertokens.types"

import EmailPassword from "supertokens-node/recipe/emailpassword"
import ThirdParty from "supertokens-node/recipe/thirdparty"
import Passwordless from "supertokens-node/recipe/passwordless"
import Session from "supertokens-node/recipe/session"
import Dashboard from "supertokens-node/recipe/dashboard"
import UserRoles from "supertokens-node/recipe/userroles"

const RecipesMap = {
  EmailPassword,
  ThirdParty,
  Passwordless,
  Session,
  Dashboard,
  UserRoles,
} as const

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(SUPERTOKENS_MODULE_OPTIONS)
    private options: SuperTokensModuleOptions,
  ) {
    const { recipes, ...stInitOptions } = options
    const recipeList = Object.keys(recipes).map((recipeName) => {
      const Recipe = RecipesMap[recipeName]
      if (!Recipe) {
        throw new Error(`Unknown recipe: ${recipeName}`)
      }
      return Recipe.init(recipes[recipeName])
    })
    supertokens.init({ ...stInitOptions, recipeList })
  }
}
