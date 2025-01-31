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

describe("SuperTokensExceptionFilter", () => {
  beforeAll(async () => {})

  it.todo("should catch authentication errors")
  it.todo("should return customized error messages")
})
