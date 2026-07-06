<!--
  Source: Pantheon Systems documentation — Terminus Guide
          https://docs.pantheon.io/terminus
  Verbatim source files (CC BY-SA 4.0) in the pantheon-systems/documentation repo:
    - 05-scripting.md (CI auth overview)
    - ci/github-actions.md
    - ci/gitlab.md
    - ci/circleci.md
    - ci/bitbucket.md
  Upstream path: https://github.com/pantheon-systems/documentation/tree/main/src/source/content/terminus/
  Note: ci/ subdirectory for the four CI provider files
  License: Creative Commons Attribution-ShareAlike 4.0 International
           https://creativecommons.org/licenses/by-sa/4.0/
  Attribution: © Pantheon Systems, Inc.
  Code snippets within are additionally licensed under The MIT License.
  Scraped: 2026-07-06

  Transformations applied to source: Docusaurus frontmatter stripped, JSX
  components (Alert/Accordion/Tab/CardGroup/Popover/Download/Releases/Commands)
  converted to standard Markdown, relative doc links made absolute, code-fence
  attributes normalized. Prose is otherwise verbatim from the source.
-->

# Continuous Integration (CI) Authentication

Terminus must be authenticated before use, and in CI you should cache the session to avoid Auth0 rate limits. The general pattern (from the scripting guide) is below, followed by provider-specific pipelines.

## Authentication

Terminus must be authenticated before you can execute most commands. You must authenticate Terminus with a [machine token](https://docs.pantheon.io/terminus/install#machine-token) that has the correct permissions before running a script.

### Authenticate Terminus for Continuous Integration

You can run a complete backend authorization in Terminus by accessing Auth0 behind the scenes to positively identify the Terminus client with an OAuth token. Auth0 places limits on how many times this can be done in a given time period. Use your machine token to authorize Terminus sparingly to avoid exceeding Auth0 rate limits.

1. Running `terminus auth:login --machine-token=${TOKEN}` to run a complete backend authorization. This process:

    - Logs in your `machine-token`
    - Allows Terminus to create a cached session in the local user's $HOME folder (for example, `$HOME/.terminus/cache/session`). Use this cached session token for repeated logins. The session file takes the following format:

        ```json
        {
        "session": "${PANTHEON_USER_ID}:${CURRENT_SESSION_ID}:${OAUTH_SESSION_TOKEN}",
        "expires_at": ${EXPIRE_DATETIME},
        "user_id": "${PANTHEON_USER_ID}"
        }
        ```

1. Restore the session file in a CI context to stay logged in without re-authenticating every time. Instructions for specific CI pipelines are listed below.

    - [Bitbucket](https://docs.pantheon.io/terminus/ci/bitbucket)
    - [CircleCI](https://docs.pantheon.io/terminus/ci/circleci)
    - [GitHub](https://docs.pantheon.io/terminus/ci/github-actions)
    - [GitLab](https://docs.pantheon.io/terminus/ci/gitlab)

---

## GitHub Actions (`ci/github-actions.md`)

This section provides information on how to to authenticate Terminus in a GitHub Actions CI pipeline without receiving errors and avoiding authentication rate limits.

## Caching Authentication for GitHub Actions

You can use the example script in this section for a full start-to-finish Terminus authentication in GitHub Actions.

This pipeline does the following:

- Uses the `ubuntu:latest` Docker image.
- Updates the system and installs necessary tools like PHP, curl, perl, sudo, and Git before the script stages.
- Defines a cache for the Terminus binary. The pipeline system will save and restore the cache for subsequent runs.
- Determines the latest release of Terminus from the GitHub API and stores it in the `TERMINUS_RELEASE` variable.
- Creates a directory for Terminus, downloads it into that directory, makes it executable, and then creates a symbolic link to it in `/usr/local/bin` so that you can run it from anywhere.
- Ensures there is a valid Terminus session populated in the encrypted cache.
- Checks that Terminus is authenticated with `terminus auth:whoami`.

> **Note**
>
> Before you use this script:
>
> - Add a Pantheon account machine token to your GitHub **environment** (preferred) or **repository** secrets named `TERMINUS_TOKEN`. _(Always store production secrets in a GitHub "Environment" that restricts which branches can deploy to it, and protect those branches with rules including code reviews and security tests)._

```yaml:title=.github/workflows/terminus-cache-auth.yml
name: CI

on: [push, pull_request]

jobs:
  connect:
    runs-on: ubuntu-latest
    # Uncomment this line if your TERMINUS_TOKEN secret belongs to a GitHub
    # Environment (preferred for security, see note above).
    # environment: <environment_name>
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
      - uses: actions/cache@v4
        id: terminus-binary
        with:
          path: ~/terminus/terminus
          key: ${{ runner.os }}-terminus-binary-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-terminus-binary-
      - name: Determine version
        shell: bash
        if: ${{ ! inputs.terminus-version }}
        run: |
          TERMINUS_RELEASE=$(
            curl --silent \
              --header 'authorization: Bearer ${{ github.token }}' \
              "https://api.github.com/repos/pantheon-systems/terminus/releases/latest" \
              | perl -nle'print $& while m#"tag_name": "\K[^"]*#g'
          )
          echo "TERMINUS_RELEASE=$TERMINUS_RELEASE" >> $GITHUB_ENV
      - name: Install Terminus
        shell: bash
        run: |
          mkdir ~/terminus && cd ~/terminus
          echo "Installing Terminus v$TERMINUS_RELEASE"
          curl -L https://github.com/pantheon-systems/terminus/releases/download/$TERMINUS_RELEASE/terminus.phar --output terminus
          chmod +x terminus
          sudo ln -s ~/terminus/terminus /usr/local/bin/terminus
        env:
          TERMINUS_RELEASE: ${{ inputs.terminus-version || env.TERMINUS_RELEASE }}
      - name: Authenticate Terminus (with session cache)
        uses: pantheon-systems/terminus-github-actions@v1
        with:
          pantheon-machine-token: ${{ secrets.TERMINUS_TOKEN }}
      - name: Whoami
        run: terminus auth:whoami
  deploy:
    needs: [connect]
    runs-on: ubuntu-latest
    # Uncomment this line if your TERMINUS_TOKEN secret belongs to a GitHub
    # Environment (preferred for security, see note above).
    # environment: <environment_name>
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
      - uses: actions/cache@v4
        id: terminus-cache
        with:
          path: ~/.terminus
          key: ${{ runner.os }}-terminus-cache-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-terminus-cache-
      - uses: actions/cache@v4
        id: terminus-binary
        with:
          path: ~/terminus/terminus
          key: ${{ runner.os }}-terminus-binary-${{ hashFiles('**/composer.lock') }}
          restore-keys: |
            ${{ runner.os }}-terminus-binary-
      - name: Authenticate Terminus (with session cache)
        uses: pantheon-systems/terminus-github-actions@v1
        with:
          pantheon-machine-token: ${{ secrets.TERMINUS_TOKEN }}
      - name: Whoami
        run: |
          sudo ln -s ~/terminus/terminus /usr/local/bin/terminus
          terminus auth:whoami

  # Continue with your build steps...
```


---

## GitLab Pipelines (`ci/gitlab.md`)

This section provides information on how to to authenticate Terminus in a GitLab CI pipeline without receiving errors and avoiding authentication rate limits.

## Caching Authentication for GitLab

You can use the example script in this section as a starting point to create your own CI scripts.

This pipeline demonstrates an initial `build` stage which installs and authenticates Terminus, followed by a `deploy_many` stage with two parallel jobs which reuse the downloaded Terminus and session token.

- Uses the `ubuntu:latest` Docker image.
- Updates the system and installs necessary tools like PHP, cURL, and PHP libraries Terminus needs before the script stages.
- Adds the current directory to `$PATH`, because you will download Terminus to the current directory.
- Sets an environment variable to store the session token inside the build directory.
- Specifies that the downloaded Terminus phar and the session folder should be cached for future jobs.
- Downloads the latest release of Terminus.
- Checks that Terminus is authenticated with `terminus auth:whoami`.
- Runs two parallel jobs in the `deploy_many` stage, which both reuse the downloaded Terminus and session token.

> **Note**
>
> Before using this script, you must add a `TERMINUS_TOKEN` variable in the repository's CI/CD settings.

```yaml
image: ubuntu:latest

variables:
  DEBIAN_FRONTEND: noninteractive  # avoid interactive prompts

before_script:
  - apt-get update -yq
  - apt-get install -y jq php curl php-xml php-mbstring

  # add current directory to $PATH
  - export PATH="${PATH}:."

  # need to store the session token inside the build directory
  - export TERMINUS_CACHE_DIR=${PWD}https://docs.pantheon.io/terminus-session

stages:
  - build
  - deploy_many

cache:
  paths:
    # holds the session login token for reuse in future jobs - $HOME/.terminus by default
    - terminus-session
    # The actual terminus phar so we only need to download it once
    - terminus

install_terminus:
  stage: build
  script:
    - export TERMINUS_RELEASE=$(curl --silent "https://api.github.com/repos/pantheon-systems/terminus/releases/latest" | jq -r .tag_name)
    - echo Fetching release ${TERMINUS_RELEASE}
    - echo "Installing Terminus v${TERMINUS_RELEASE}"
    - curl -L https://github.com/pantheon-systems/terminus/releases/download/${TERMINUS_RELEASE}https://docs.pantheon.io/terminus.phar --output terminus
    - chmod +x terminus
    - mkdir -p ${PWD}https://docs.pantheon.io/terminus-session
    - terminus -vvv auth:login --machine-token="${TERMINUS_TOKEN}"
    - terminus -vvv auth:whoami

deployment_one:
  stage: deploy_many
  dependencies: [install_terminus]
  script:
    - terminus -vvv auth:whoami

deployment_two:
  stage: deploy_many
  dependencies: [install_terminus]
  script:
    - terminus -vvv auth:whoami
```


---

## CircleCI (`ci/circleci.md`)

This section provides information on how to authenticate Terminus in a CircleCI pipeline without receiving errors and avoiding authentication rate limits.

## Caching Authentication for CircleCI Pipelines

You can use the example script in this section for a full start-to-finish Terminus authentication in CircleCI. This pipeline does the following:

- Defines an executor with an Ubuntu environment, which installs PHP.
- Defines a command `install_dependencies` which does the following:
    - Checks out the code.
    - Installs necessary packages.
    - Restores cache of `~/.terminus` folder if it exists.
    - Fetches the latest version of Terminus from the GitHub API.
    - Installs Terminus and adds its path to the environment variable `$PATH`.
    - Saves the cache for the `~/.terminus` folder.
    - Authenticates Terminus.
    - Validates Terminus is logged in.
- Defines a job `build` that uses the `install_dependencies` command.
- Defines a workflow that executes the `build` job.

> **Note**
>
> Before you use this script:
>
> - Replace `TOKEN` in the script below with the machine token provided by Terminus.
> - Add the machine token provided by Terminus to your environment variables in the CircleCI project settings.

```yaml
version: 2.1

executors:
  ubuntu-executor:
    docker:
      - image: circleci/php:latest

commands:
  install_dependencies:
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: |
            sudo apt-get update
            sudo apt-get install -y php curl perl git jq
      - restore_cache:
          keys:
            - terminus-cache-{{ .Environment.CIRCLE_BRANCH }}-{{ checksum "composer.lock" }}
            - terminus-cache-{{ .Environment.CIRCLE_BRANCH }}-
            - terminus-cache-
      - run:
          name: Install Terminus
          command: |
            export TERMINUS_RELEASE=$(curl --silent "https://api.github.com/repos/pantheon-systems/terminus/releases/latest" | jq -r .tag_name)
            mkdir ~/terminus && cd ~/terminus
            echo "Installing Terminus v$TERMINUS_RELEASE"
            curl -L https://github.com/pantheon-systems/terminus/releases/download/$TERMINUS_RELEASE/terminus.phar --output terminus
            chmod +x terminus
            echo 'export PATH=$PATH:~/terminus' >> $BASH_ENV
      - save_cache:
          key: terminus-cache-{{ .Environment.CIRCLE_BRANCH }}-{{ checksum "composer.lock" }}
          paths:
            - ~/.terminus
      - run:
          name: Authenticate Terminus
          command: |
            terminus auth:login || terminus auth:login --machine-token="${TERMINUS_TOKEN}"
      - run:
          name: Validate Terminus
          command: terminus auth:whoami

jobs:
  build:
    executor: ubuntu-executor
    steps:
      - install_dependencies

workflows:
  version: 2
  build-deploy:
    jobs:
      - build
```


---

## Bitbucket Pipelines (`ci/bitbucket.md`)

This section provides information on how to to authenticate Terminus in a Bitbucket CI pipeline without receiving errors and avoiding authentication rate limits.

## Caching Authentication for Bitbucket Pipelines

You can use the example script in this section for a full start-to-finish Terminus authentication in Bitbucket. This pipeline does the following:

- Uses the `ubuntu:latest` Docker image.
- Performs `git clone` to checkout the code from the repository.
- Updates the system and installs necessary tools like PHP, curl, perl, sudo, and Git.
- Determines the latest release of Terminus from the GitHub API and stores it in the `TERMINUS_RELEASE` variable.
- Creates a directory for Terminus, downloads it into that directory, makes it executable, and then creates a symbolic link to it in `/usr/local/bin` so that you can run it from anywhere.
- Exports the `TERMINUS_TOKEN` environment variable (assuming that you've already set it in your pipeline settings) and uses it to authenticate Terminus.
- Checks that Terminus is authenticated with `terminus auth:whoami`.
- Defines a cache for the `$HOME/.terminus` directory. The pipeline system will save and restore the cache for subsequent runs.

> **Note**
>
> Before you use this script:
>
> - Ensure that you have defined `TERMINUS_TOKEN` in Bitbucket Pipeline's Environment Variables.
> - Replace `${TERMINUS_TOKEN}` in the script below with the machine token provided by Terminus.
> - Add the machine token provided by Terminus to your environment variables in the Bitbucket pipeline settings.

```yaml:title=bitbucket-pipelines.yml

image: ubuntu:latest

pipelines:
  default:
    - step:
        name: Install and Configure PHP and Terminus
        script:
          - apt-get update
          - apt-get install -y php curl perl sudo git jq
          - git clone $BITBUCKET_CLONE_URL .
          - export TERMINUS_RELEASE=$(curl --silent "https://api.github.com/repos/pantheon-systems/terminus/releases/latest" | jq -r .tag_name)
          - mkdir ~/terminus && cd ~/terminus
          - echo "Installing Terminus v$TERMINUS_RELEASE"
          - curl -L https://github.com/pantheon-systems/terminus/releases/download/$TERMINUS_RELEASE/terminus.phar --output terminus
          - chmod +x terminus
          - sudo ln -s ~/terminus/terminus /usr/local/bin/terminus
          - export TERMINUS_TOKEN=$TERMINUS_TOKEN
          - terminus auth:login || terminus auth:login --machine-token="${TERMINUS_TOKEN}"
          - terminus auth:whoami
        caches:
          - terminus

definitions:
  caches:
    terminus: $HOME/.terminus
```

