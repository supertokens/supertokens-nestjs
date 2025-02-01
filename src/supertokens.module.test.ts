import { describe, it, beforeAll, expect, beforeEach } from "vitest"
import request from "supertest"
import { INestApplication, Module } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import Session from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"

import { Controller, Get } from "@nestjs/common"
import { SuperTokensModule } from "./supertokens.module"
import { SuperTokensExceptionFilter } from "./supertokens-exception.filter"
import { getSuperTokensCORSHeaders } from "./supertokens.utils"

const AppInfo = {
  appName: "ST",
  apiDomain: "http://localhost:3001",
  websiteDomain: "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
}

const connectionUri = "https://try.supertokens.io"

describe("SuperTokensModule", () => {
  beforeAll(async () => {})

  it("should initialize with forRoot", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRoot({
          framework: "express",
          supertokens: {
            connectionURI: connectionUri,
          },
          appInfo: AppInfo,
          recipeList: [Session.init()],
        }),
      ],
    }).compile()

    const app = moduleRef.createNestApplication()
    await app.init()
    const module = app.get(SuperTokensModule)
    expect(module).toBeDefined()
    await app.close()
  })

  it("should initialize with forRootAsync", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRootAsync({
          useFactory: async () => ({
            framework: "express",
            supertokens: {
              connectionURI: connectionUri,
            },
            appInfo: AppInfo,
            recipeList: [Session.init()],
          }),
          inject: [],
        }),
      ],
    }).compile()

    const app = moduleRef.createNestApplication()
    await app.init()
    const module = app.get(SuperTokensModule)
    expect(module).toBeDefined()
    await app.close()
  })

  it.todo("should expose the SDK routes via the express middleware")
  it.todo("should expose the SDK routes via the fastify adapter")
})
