# Releasing `supertokens-nestjs`

## One-time maintainer setup

- In GitHub, restrict the `publish` environment's deployment branches to `main` only (no tags) before registering the publisher. The workflow's branch condition applies to its checked-in copy; the environment restriction also blocks other refs that declare the same environment.
- In the npm settings for `supertokens-nestjs`, add a [GitHub Actions trusted publisher](https://docs.npmjs.com/trusted-publishers) with these values:
  - **Organization or user:** `supertokens`
  - **Repository:** `supertokens-nestjs`
  - **Workflow filename:** `release.yml` (filename only)
  - **Environment name:** `publish`
  - **Allowed actions:** Enable direct `npm publish`. Dist-tag management is not needed.

Register when ready to release: npm requires the first successful publish within two days. If the registration expires, delete and recreate it before publishing. The workflow uses OIDC and does not read an npm token or change any existing secrets.

## Publish an approved version

1. Confirm the intended version is on `main` after merging the PR created by [Version Packages](.github/workflows/version.yml).
2. In GitHub Actions, open [Release](https://github.com/supertokens/supertokens-nestjs/actions/workflows/release.yml), choose **Run workflow**, and select `main`. Do not rerun an old run to pick up changes: the workflow checks out the commit selected at dispatch.
3. Check the published npm version, Git tag, and GitHub release. If versioning or trusted publisher setup is incomplete, fix it and start a fresh run from `main`. If npm published the version but the tag or GitHub release failed, verify the npm publication before repairing the missing GitHub metadata; retrying does not republish that version.
