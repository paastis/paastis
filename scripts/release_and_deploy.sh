#!/usr/bin/env bash

# USAGE:
# - You must have npm installed
# - You must have an account on npmjs
# - You must be authenticated for npmjs
# - You must be authorized as a contributor
# - You must be authorized to push on GitHub repository

set -euo pipefail

# Set colors
RESET_COLOR="\033[0m"
BOLD="\033[1m"
OFFBOLD="\033[21m"

# Colors (bold)
RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
BLUE="\033[1;34m"
CYAN="\033[1;36m"

CWD_DIR=$(pwd)
GITHUB_OWNER="paastis"
GITHUB_REPOSITORY="paastis"
VERSION_TYPE=(${1-""})
BRANCH_NAME="main"
REPOSITORY_URL=git@github.com:paastis/paastis.git
REGISTRY_URL=https://www.npmjs.com/package/paastis

function clone_repository_and_move_inside {
  REPOSITORY_FOLDER=$(mktemp -d)
  echo "Created temporary directory ${REPOSITORY_FOLDER}"
  git clone --depth 1 --branch "${BRANCH_NAME}" "${REPOSITORY_URL}" "${REPOSITORY_FOLDER}"
  echo "Cloned repository ${GITHUB_OWNER}/${GITHUB_REPOSITORY} to temporary directory"

  cd "${REPOSITORY_FOLDER}" || exit 1
  echo "Moved to repository folder"
}

function configure_git_user_information {
  git config user.name "${GIT_USER_NAME}"
  git config user.email "${GIT_USER_EMAIL}"
  echo "Set Git user information"
}

function get_package_version() {
  node -p -e "require('./package.json').version"
}

function create_release {
  PREVIOUS_PACKAGE_VERSION=$(get_package_version)
  npm_arg="" && [[ -n "$VERSION_TYPE" ]]  && npm_arg="$VERSION_TYPE"
  npm version "${npm_arg}" --no-git-tag-version
  NEW_PACKAGE_VERSION=$(get_package_version)
}

function create_a_release_commit {
  #git add CHANGELOG.md
  git add --update package*.json

  git commit --message "A ${VERSION_TYPE} version is being released to ${NEW_PACKAGE_VERSION}."

  echo "Created the release commit"
}

function tag_release_commit() {
  git tag --annotate "v${NEW_PACKAGE_VERSION}" --message "See CHANGELOG file to see what's changed in new release."
  echo "Created annotated tag"
}

function push_commit_and_tag_to_remote() {
  git push --follow-tags origin
  echo "Pushed release commit to the origin"
}

function publish_on_registry() {
  npm publish --access=public
  echo "Published release on ${REGISTRY_URL}"
}

echo "Version type ${VERSION_TYPE} for ${GITHUB_OWNER}/${GITHUB_REPOSITORY}"

echo "Start deploying version ${VERSION_TYPE}…"

clone_repository_and_move_inside
#configure_git_user_information
create_release
create_a_release_commit
tag_release_commit
push_commit_and_tag_to_remote
publish_on_registry

echo -e "Release publication for ${GITHUB_OWNER}/${GITHUB_REPOSITORY} ${GREEN}succeeded${RESET_COLOR} (${VERSION_TYPE})."
