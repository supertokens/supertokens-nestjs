import { describe, it, beforeAll, expect, beforeEach } from "vitest"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import Session from "supertokens-node/recipe/session"

import { SuperTokensModule } from "./supertokens.module"

const AppInfo = {
  appName: "ST",
  apiDomain: "http://localhost:3001",
  websiteDomain: "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
}

const connectionUri = "https://try.supertokens.io"

describe("SuperTokensAuthGuard", () => {
  beforeAll(async () => {})

  it.todo("should be called on a specific route")
  it.todo("should be called on a specific controller")
  it.todo("should be called globally")
  describe("PublicAccess decorator", () => {
    it.todo("enables public access on a route")
  })
  describe("VerifySession decorator", () => {
    it.todo("changes the get session options")
  })
  describe("Auth decorator", () => {
    it.todo("allows access on a route based on a role")
    it.todo("does not allow access on a route based on a role")
    it.todo("allows access on a route based on a permission")
    it.todo("does not allow access on a route based on a permission")
    it.todo("allows access on a route based on both email verification")
    it.todo("does not allow access on a route based on email verification")
    it.todo("allows access on a route based on MFA")
    it.todo("does not allow access on a route based on MFA")
  })
})
