import { NestFactory } from "@nestjs/core"
import supertokens from "supertokens-node"

type NestApp = Awaited<ReturnType<typeof NestFactory.create>>

export function getSuperTokensCORSHeaders() {
  return ["content-type", ...supertokens.getAllCORSHeaders()]
}
