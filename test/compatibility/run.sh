#!/usr/bin/env bash
set -euo pipefail

nest="${1:?Pass an exact NestJS version}"
nest_graphql="${2:?Pass the matching exact Nest GraphQL and Apollo driver version}"
apollo="${3:?Pass an exact Apollo Server version}"

workspace="$(mktemp -d)"
trap 'rm -rf "$workspace"' EXIT
HUSKY=0 npm pack --ignore-scripts --silent --pack-destination "$workspace" >/dev/null
archives=("$workspace"/*.tgz)
archive="${archives[0]}"
fixtures="$PWD/test/compatibility"

for adapter in express fastify; do
  (
    mkdir "$workspace/$adapter"
    cd "$workspace/$adapter"
    npm init -y >/dev/null
    # Install only the adapter in use, as a consumer would.
    dependencies=(
      "$archive"
      "@nestjs/common@$nest"
      "@nestjs/core@$nest"
      "@nestjs/platform-$adapter@$nest"
      @types/node@20.19.0
      supertokens-node@24.0.0
      typescript@5.9.3
    )
    if [[ "$adapter" == express ]]; then
      dependencies+=(
        "@nestjs/apollo@$nest_graphql"
        "@nestjs/graphql@$nest_graphql"
        "@apollo/server@$apollo"
        @types/supertest@6.0.3
        graphql@16.15.0
        supertest@7.3.2
      )
      if [[ "$apollo" == 5.* ]]; then
        dependencies+=(@as-integrations/express5@1.1.2)
      fi
    fi

    npm install --strict-peer-deps --no-audit --no-fund "${dependencies[@]}"
    cp "$fixtures/tsconfig.json" "$fixtures/shared.ts" "$fixtures/$adapter.ts" .
    ./node_modules/.bin/tsc --project tsconfig.json
    node --test "dist/$adapter.js"
  )
done
