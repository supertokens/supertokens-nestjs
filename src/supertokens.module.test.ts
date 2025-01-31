import { describe, it, beforeAll, expect, beforeEach } from "vitest"
import request from "supertest"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import Session from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"

import { SuperTokensModule } from "./supertokens.module"

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
  })

  it("should expose the SDK routes via the express middleware", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SuperTokensModule.forRootAsync({
          useFactory: async () => ({
            framework: "express",
            supertokens: {
              connectionURI: connectionUri,
            },
            appInfo: AppInfo,
            recipeList: [Session.init(), EmailPassword.init()],
          }),
          inject: [],
        }),
      ],
    }).compile()

    const app = moduleRef.createNestApplication<INestApplication>()
    await app.init()

    await request(app.getHttpServer()).post(`/`).expect(200)

    await request(app.getHttpServer())
      .post(`${AppInfo.apiBasePath}/signup`)
      .expect(400)
  })
  it.todo("should expose the SDK routes via the fastify adapter")
})
