#!/bin/bash -xe

# Add yarn to the $PATH so npm cli commands do not fail
export PATH="${PATH}:$(yarn global bin)"

# Install required node version
export NVM_DIR="/root/.nvm"
NODE_VERSION="${1:-v12.13.0}"
echo $NODE_VERSION
setup_service node $NODE_VERSION

cd ${OKTA_HOME}/${REPO}

# Yarn does not utilize the npmrc/yarnrc registry configuration
# if a lockfile is present. This results in `yarn install` problems
# for private registries. Until yarn@2.0.0 is released, this is our current
# workaround.
#
# Related issues:
#  - https://github.com/yarnpkg/yarn/issues/5892
#  - https://github.com/yarnpkg/yarn/issues/3330

YARN_REGISTRY=https://registry.yarnpkg.com
OKTA_REGISTRY=${ARTIFACTORY_URL}/api/npm/npm-okta-master

# Replace yarn artifactory with Okta's
sed -i "s#${YARN_REGISTRY}#${OKTA_REGISTRY}#g" yarn.lock

# Install dependences. --ignore-scripts will prevent chromedriver from attempting to install
if ! yarn install --frozen-lockfile --ignore-scripts; then
  echo "yarn install failed! Exiting..."
  exit ${FAILED_SETUP}
fi

# Revert the original change
sed -i "s#${OKTA_REGISTRY}#${YARN_REGISTRY}#" yarn.lock

# Build
if ! yarn build; then
  echo "build failed! Exiting..."
  exit ${TEST_FAILURE}
fi