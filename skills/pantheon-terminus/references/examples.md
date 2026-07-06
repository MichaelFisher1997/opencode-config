<!--
  Source: Pantheon Systems documentation — Terminus Guide
          https://docs.pantheon.io/terminus
  Verbatim source files (CC BY-SA 4.0) in the pantheon-systems/documentation repo:
    - 03-examples.md
    - 07-create.md
  Upstream path: https://github.com/pantheon-systems/documentation/tree/main/src/source/content/terminus/
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

# Examples, Workflows & Plugin Authoring


---

## Common Examples & Workflows (`03-examples.md`)

This section provides information on how to apply updates, deploy code, switch upstreams, and install Drush and WP-CLI with Terminus, as well as information on command structure and automatic site and environment detection.

## Understand Commands

### Basic Format

The basic format of a Terminus command is:

```bash
terminus command:subcommand <site>.<env>
```

### More Information Command

You can find more information on any command:

```bash
terminus command:subcommand -h
```

### List of Commands

You can get a list of all available commands:

```bash
terminus list
```

### site.env

Terminus command structure typically includes `<site>.<env>` in order to determine the target site and environment to execute against. Note that the `<>` symbols are part of the example, and should not to be included in your commands. For example, running the `env:clear-cache` command for the Live environment of a site labeled "Your Awesome Site":

![terminus env:clear-cache your-awesome-site.live](https://raw.githubusercontent.com/pantheon-systems/documentation/main/src/source/images/terminus-example-cc.png)

> **Learn More**
>
> **Site Label**
> Human readable, such as `Your Awesome Site`, entered during site creation and displayed in the Site Dashboard.
>
> **Site Name**
> Machine readable, such as `your-awesome-site`, either derived automatically by the platform from the site label or uniquely defined during site creation via Terminus. This value is used to construct [platform domains](https://docs.pantheon.io/guides/domains).
>
> **Environment Name**
> Machine readable, such as `dev`, `test`, `live`, or `bug123`, which refers to the target site environment on Pantheon.
>
> You can also find your site's machine name using the Terminus command `site:info`, and the [site UUID](https://docs.pantheon.io/guides/account-mgmt/workspace-sites-teams/workspaces#retrieve-the-workspace-uuid). For example:
>
> ![terminus site:info e9ad4349-621e-4be6-9f94-f9646069d9e7 --field name](https://raw.githubusercontent.com/pantheon-systems/documentation/main/src/source/images/terminus-examples-field-name.png)

### Automatic Site and Environment Detection

Terminus automatically detects the site and environment if a `<site>.<env>` parameter is not provided to a command that requests one. Terminus detects and operates from the local copy and current branch of the Pantheon site checked out at the current working directory.

```bash
git clone ssh://codeserver.dev.UUID@codeserver.dev.UUID.drush.in:2222/~/repository.git mysite
cd mysite
terminus env:info
```

The example above is equivalent to `terminus env:info mysite.dev`.

### Drush and WP-CLI

Pantheon supports [Drush (Drupal)](https://drushcommands.com/) and [WP-CLI (WordPress)](https://developer.wordpress.org/cli/commands/) commands remotely against a target site environment through Terminus. This is often faster and easier than leveraging such tools via local installations.

1. Use the [basic command structure described above](#command-structure).

  The commands to invoke Drush and WP-CLI are:
   - `remote:drush`
   - `remote:wp`

1. Include `--` followed by the Drush or WP-CLI command and all arguments. For example:

  ![terminus remote:wp your-awesome-site.dev --plugin activate debug-bar](https://raw.githubusercontent.com/pantheon-systems/documentation/main/src/source/images/terminus-wp-cli-example.png)

Refer to [Drupal Drush Command-Line Utility](https://docs.pantheon.io/guides/drush) and [Use WP-CLI On The Pantheon Platform](https://docs.pantheon.io/guides/wp-cli) for more information.

## Apply Updates

You can quickly apply updates from the command line with Terminus, including updates to:

- Core
- Contributed modules
- Themes
- Plugins

### Upstream Updates (Core)

Pantheon maintains upstream updates for [WordPress](https://github.com/pantheon-systems/WordPress) and [Drupal](https://github.com/pantheon-systems/drops-7). Updates can be applied after they have been merged into the upstream and become available for a site.

> **Note**
>
> Refer to [Upstream Updates](https://docs.pantheon.io/core-updates#apply-upstream-updates-manually-from-the-command-line-to-resolve-merge-conflicts) for instructions on how to resolve merge conflicts.

1. List available upstream updates:

  ```bash
  terminus upstream:updates:list my-site
  ```

  If the environment's connection mode is currently set to SFTP with uncommitted work you want to keep, commit before proceeding:

  ```bash
  terminus env:commit my-site.dev --message="My code changes"
  ```

> **Warning**
>
>   The following command will permanently delete all uncommitted SFTP changes. Commit your work before proceeding if you want to keep SFTP changes.

1. Set the environment's connection mode to Git to pull updates into the site from Pantheon's upstream:

  ```bash
  terminus connection:set my-site.dev git
  ```

1. Apply available upstream updates for WordPress and Drupal core from the command line with Terminus:

  ```bash
  terminus upstream:updates:apply my-site
  ```

### Module, Theme, and Plugin Updates

Apply updates to all contributed modules, themes, and plugins via Terminus by setting the environment's connection mode to SFTP and invoking [Drush](https://docs.pantheon.io/guides/drush) (Drupal) or [WP-CLI](https://docs.pantheon.io/guides/wp-cli) (WordPress) update commands. You can then use Terminus to commit updates to a development environment on Pantheon.

#### Drupal

1. Set the Dev environment's connection mode to SFTP:

  ```bash
  terminus connection:set my-site.dev sftp
  ```

1. Apply updates to all contrib projects:

  ```bash
  terminus drush my-site.dev -- pm-updatecode --no-core
  ```

1. Commit contrib updates to the Dev environment:

  ```bash
  terminus env:commit my-site.dev --message="Update all contrib projects"
  ```

#### WordPress

1. Set the Dev environment's connection mode to SFTP:

  ```bash
  terminus connection:set my-site.dev sftp
  ```

1. Apply updates to all plugins:

  ```bash
  terminus wp my-site.dev -- plugin update --all
  ```

1. Apply updates to all themes:

  ```bash
  terminus wp my-site.dev -- theme update --all
  ```

1. Commit plugin and theme updates to the Dev environment:

  ```bash
  terminus env:commit my-site.dev --message="Update all plugins and themes"
  ```

### Mass Update

Terminus supports third-party plugins that extend functionality by adding new commands. The following example demonstrates the [Mass Update](https://github.com/pantheon-systems/terminus-mass-update) plugin to apply upstream updates (core updates) in bulk. Refer to the [Plugins](https://docs.pantheon.io/terminus/plugins) section for instructions on how to install Terminus plugins.

1. Install the [Mass Update](https://github.com/pantheon-systems/terminus-mass-update) plugin, then use the `--dry-run` option to review available upstream updates without applying them:

  ```bash
  terminus site:list --format=list | terminus site:mass-update:apply --accept-upstream --updatedb --dry-run
  ```

  The output should be similar to this:

  ```bash
  [notice] Found 3 sites.
  [notice] Fetching the list of available updates for each site...
  [notice] 3 sites need updates.
  [warning] Cannot apply updates to novasoft-drupal because the dev environment is not in git mode.
  [DRY RUN] Applying 2 updates to jessiem-drupal7
  [DRY RUN] Applying 10 updates to superb-central
  ```

1. Resolve warning messages shown in the `--dry-run` output by setting the connection mode to Git for each applicable site:

> **Warning**
>
>   The following command will permanently delete all uncommitted SFTP changes. Commit your work before continuing if you want to keep SFTP changes.

  ```bash
  terminus connection:set my-site.dev git
  ```

1. Review the output and then apply the mass update by removing the `--dry-run` option:

  ```bash
  terminus site:list --format=list | terminus site:mass-update:apply --accept-upstream --updatedb
  ```

## Deploy Code

You can use Terminus to test a new set of changes by deploying code from development environments up to the Test environment while pulling the database and files down from Live.

1. Run the command below to deploy the code:

  ```bash
  terminus env:deploy my-site.test --sync-content --note="Deploy core and contrib updates"
  ```

1. Clear the site after each deployment:

  ```bash
  terminus env:clear-cache <site>.test
  ```

1. Test the changes, and then use Terminus to deploy code from Test up to Live:

  ```bash
  terminus env:deploy my-site.live --note="Deploy core and contrib updates"
  ```

1. Clear the site after each deployment:

  ```bash
  terminus env:clear-cache <site>.live
  ```

## Reset Dev Environment to Live

There are a few scenarios where it may be useful to reset your Dev environment (codebase, files, and database) to your Live state:

- Development work that is not ready to go live has been committed directly to the Dev environment, blocking the deployment pipeline for other work ready to be deployed. After preserving work in progress on a local branch or on a [Multidev](https://docs.pantheon.io/guides/multidev) environment,you can unblock deploys by resetting the Dev environment to reflect the Live environment state.

- Code changes were force-pushed or incorrectly merged into the Dev environment creating a large or complex Git history that you wish to undo.

- The state of the Dev environment is stale or out of date with the Live environment with many unneeded changes you want to abandon.

- The Dev environment has been seriously corrupted and you would like to cleanly reset it to Live.

#### All others

Follow the steps below to reset Dev to Live.

1. Clone the site's codebase to your local machine if you have not done so already (replace `awesome-site` with your site name):

  ```bash
  terminus connection:info awesome-site.dev --fields='Git Command' --format=string
  ```

1. Automate the procedure for resetting Dev to Live by downloading the following bash script:

_Download script: `reset-dev-to-live.sh` (contents shown inline below)._

  ```bash
  #!/bin/bash

  #Authenticate Terminus
  terminus auth:login

  #Provide the target site name (e.g. your-awesome-site)
  echo 'Provide the site name (e.g. your-awesome-site), then press [ENTER] to reset the Dev environment to Live:';
  read SITE;

  #Set the Dev environment's connection mode to Git
  echo "Making sure the environment's connection mode is set to Git...";
  terminus connection:set $SITE.dev git

  #Identify the most recent commit deployed to Live and overwrite history on Dev's codebase to reflect Live
  echo "Rewriting history on the Dev environment's codebase...";
  git reset --hard `terminus env:code-log $SITE.live --format=string | grep -m1 'live' | cut -f 4`

  #Force push to Pantheon to rewrite history on Dev and reset codebase to Live
  git push origin master -f

  #Clone database and files from Live into Dev
  echo "Importing database and files from Live into Dev...";
  terminus env:clone-content $SITE.live dev

  #Open the Dev environment on the Site Dashboard
  terminus dashboard:view $SITE.dev
  ```

1. Execute the script from the command line within the root directory of your site's codebase:

  ```bash
  sh /PATH/TO/SCRIPT/reset-dev-to-live.sh
  ```

The Site Dashboard will open when the reset procedure completes.

#### Integrated Composer

Follow the steps below to reset Dev to Live.

> **Note**
>
> We've adjusted the following script for [Integrated Composer sites](https://docs.pantheon.io/guides/integrated-composer), so that you reset history to the **second** to last commit hash on the Live environment, rather than the most recent - to avoid resetting history to a build artifact.

1. Clone the site's codebase to your local machine if you have not done so already (replace `awesome-site` with your site name):

  ```bash
  terminus connection:info awesome-site.dev --fields='Git Command' --format=string
  ```

1. Automate the procedure for resetting Dev to Live by downloading the following bash script:

_Download script: `ic-reset-dev-to-live.sh` (contents shown inline below)._

  ```bash
  #!/bin/bash

  #Authenticate Terminus
  terminus auth:login

  #Provide the target site name (e.g. your-awesome-site)
  echo 'Provide the site name (e.g. your-awesome-site), then press [ENTER] to reset the Dev environment to Live:';
  read SITE;

  #Set the Dev environment's connection mode to Git
  echo "Making sure the environment's connection mode is set to Git...";
  terminus connection:set $SITE.dev git

  #Identify the second most recent commit deployed to Live and overwrite history on Dev's codebase to reflect Live
  echo "Rewriting history on the Dev environment's codebase...";
  git reset --hard `terminus env:code-log $SITE.live --format=string | grep -m2 'live' | tail -n 1 | cut -f 4`

  #Force push to Pantheon to rewrite history on Dev and reset codebase to Live
  git push origin master -f

  #Clone database and files from Live into Dev
  echo "Importing database and files from Live into Dev...";
  terminus env:clone-content $SITE.live dev

  #Open the Dev environment on the Site Dashboard
  terminus dashboard:view $SITE.dev
  ```

1. Execute the script from the command line within the root directory of your site's codebase:

  ```bash
  sh /PATH/TO/SCRIPT/reset-dev-to-live.sh
  ```

The Site Dashboard will open when the reset procedure completes.

## Switch Upstreams

Every site has an assigned upstream to deliver [one-click updates](https://docs.pantheon.io/core-updates) in the Pantheon Site Dashboard. Terminus can be used to manage this site-level configuration. There are a few scenarios where it may be useful to change a site's upstream:

- Convert existing sites from a default framework to a [Custom Upstream](https://docs.pantheon.io/guides/custom-upstream).
- Convert existing sites from one Custom Upstream to another, for reasons such as:
  - Repository has been migrated from Bitbucket to Github, or vice versa.
  - Code has been refactored and moved to a new repository.
- Set an empty upstream to disable one-click updates for sites managed by Composer.

1. Run the command below to see all available upstreams:

  ```bash
  terminus upstream:list
  ```

  If your Workspace has a [Custom Upstream](https://docs.pantheon.io/guides/custom-upstream), you can use Terminus to switch existing sites over to the common codebase:

  ```bash
  terminus site:upstream:set my-site "My Custom Upstream"
  ```

1. Use any valid identifier (upstream name, upstream machine name, upstream UUID) returned in `terminus upstream:list` to set a new upstream. For example, the upstream name "My Custom Upstream" is used above.

  As a safeguard, Terminus will prevent a framework switch such as moving from Drupal to WordPress or vice versa.

> **Note**
>
>   Refer to [Serving Sites from the Web Subdirectory](https://docs.pantheon.io/nested-docroot/) to set an empty upstream for Composer-managed sites.

1. Apply updates to the site to bring in the new codebase after setting the upstream. Refer to the [example usage above](#applying-updates) for information on how to apply updates.

## Troubleshoot Upstreams

### Terminus Error: Permission to change the upstream of this site

If you encounter this error when setting a site's upstream:

```bash
terminus site:upstream:set $SITE $UPSTREAM
 [error]  You do not have permission to change the upstream of this site.
```

1. Confirm that the authenticated user account has the correct [site-level permissions](https://docs.pantheon.io/guides/account-mgmt/workspace-sites-teams/teams#site-level-permissions).

1. Check the currently authenticated user:

```bash
terminus auth:whoami
```

## More Resources

- [WordPress and Drupal Core Updates](https://docs.pantheon.io/core-updates)
- [Custom Upstreams](https://docs.pantheon.io/guides/custom-upstream)


---

## Create Terminus Plugins (`07-create.md`)

This section provides information on how to create Terminus plugins.

Creating a plugin allows you to add custom commands to Terminus. The sections below provide instructions on how to create Pantheon's [example plugin](https://github.com/pantheon-systems/terminus-plugin-example) and add new commands.

## Create the Example Plugin

Terminus has a plugin manager that includes a command for scaffolding a new, empty plugin.

1. Run the command below to create a new plugin:

  ```bash
  terminus self:plugin:create hello-world --project-name=terminus-plugin-project/hello-world
  ```

  This commands creates a directory called `hello-world` and populates it with an example plugin template, renamed to match the provided project name. The project name is only required if you plan to publish and distribute your plugin (e.g. on Packagist).

  The `self:plugin:create` command also installs your new plugin so that you can start using it immediately.

1. Review the two files in the example plugin's `Commands` directory, each of which contains an example command.

1. Open the `src/Commands/HelloCommand.php` file, and modify the output as shown below:

  ```php
  namespace Pantheon\TerminusHello\Commands;

  use Pantheon\Terminus\Commands\TerminusCommand;

  class HelloCommand extends TerminusCommand
  {
      /**
       * Print the classic message to the log.
       *
       * @command hello
       * @param string $name Who to say "hello" to.
       * @option $first This is the first time we've said hello.
       */
      public function sayHello($name = 'World', $options = ['first' => false])
      {
          $this->log()->notice("Hello, {user}! THIS IS MY MODIFICATION TO THE PLUGIN.", ['user' => $name]);
          if ($options['first']) {
              $this->log()->notice("Pleased to meet you.");
          }
      }
  }

  ```

  The command should now be recognized and loaded by Terminus:

  ```bash
  terminus hello
  ```

  The provided example command should display the following when run:

  ```bash
  [notice] Hello, World! THIS IS MY MODIFICATION TO THE PLUGIN.
  ```

1. Modify the `@command` line to change the name of your command. You can rename the source file in which the command is stored, as long as it ends in `Command.php`.

## Distribute Plugin

You must complete the steps below if you want to share your plugin with others.

> **Warning**
>
> Some of the following instructions may break your plugin temporarily. We recommend you to uninstall your plugin (`terminus self:plugin:uninstall <plugin_name>`) and then re-install it (`terminus self:plugin:install <plugin_dir>`) after executing them.

1. Add a vendor name to the plugin name within the `composer.json` file. This makes your plugin distinguishable from other plugins that might share the same name. Most people use their GitHub user or organization name for the vendor. The name field for a plugin distributed by Pantheon (GitHub organization: `pantheon-systems`) would be:

  ```json
  {
    "name": "pantheon-systems\terminus-hello-world"
  }
  ```

1. Add a PSR-4 compatible namespace to your plugin command class name to avoid conflict with internal or third-party commands. This should contain your vendor name and the plugin name. Add a `namespace` declaration to the top of your PHP file (e.g. `\$HOME/.terminus/plugins/hello-world/src/HelloCommand.php`):

  ```bash
  namespace Pantheon\TerminusHelloWorld\Commands;
  ```

  The `Commands` part of the namespace is not necessary but it can help keep things organized if you need to add supporting classes to your plugin.

1. Make sure your `src` directory and composer file reflect the new namespace. Move the `HelloCommand.php` file from `src/` to the `src/Commands` directory to mirror the last part of the namespace. If you have a lot of commands in your plugin, you can organize them into command groups by adding another layer to the namespace and directory structure.

1. Update the `composer.json` file with an autoload section to indicate how to load your namespace. Change `my-username` and `Pantheon` in the example to your vendor name. Your composer file should now look like:

  ```json
  {
    "name": "my-username/terminus-hello-world",
    "description": "An Hello, World Terminus command",
    "type": "terminus-plugin",
    "autoload": {
      "psr-4": { "Pantheon\\TerminusHello\\": "src" }
    },
    "extra": {
      "terminus": {
        "compatible-version": "^3"
      }
    }
  }
  ```

1. Update the `composer.json` file with a `require` section that lists all of the external projects you need, along with their version constraints. 

## Coding Standards

Pantheon recommends adopting Terminus core standards if you plan to distribute your plugin and/or add it to an open source license and encourage contributions. Some basic principles to follow are:

- Ensure compatibility with PHP >=7.4 and 8
- Follow [PSR-2 code style](http://www.php-fig.org/psr/psr-2/)
- Review more Terminus standards at:
[https://github.com/pantheon-systems/terminus/blob/master/CONTRIBUTING.md](https://github.com/pantheon-systems/terminus/blob/master/CONTRIBUTING.md)

## Plugin Versioning

We recommend following [semantic versioning](http://semver.org/) when versioning your plugins, just as Terminus does.

You can specify this in the `compatible-version` section of your `composer.json` file if your plugin has a minimum required version of Terminus.

1. Use the [standard composer version constraints syntax](https://getcomposer.org/doc/articles/versions.md).

1. Make sure that your constraint expression does not accidentally include the next major version of Terminus if you change `compatible-version`. For example, **&gt;=3.0 &lt;4.0.0** is fine, but **&gt;=3.0** is not.

1. Add a new Git tag to the repository. This publishes the plugin as a new version in Packagist. Note that additional steps may be required depending on your plugin needs.

## Test Plugins

Automated plugin testing is an important step to complete before you distribute your plugins. Automated tests give prospective new users the assurance that the plugin works, and provides a basis for evaluating changes to the plugin.

The instructions in this section demonstrate how to set up simple functional tests for Terminus plugins using Bats, the [Bash Automated Testing System](https://github.com/sstephenson/bats). Bats allows tests to be written with simple Bash statements.

1.  Copy the `require-dev` and `scripts` sections from the `composer.json` file below into the `composer.json` of your Terminus plugin:

    ```json
    {
        "name": "my-username/terminus-hello-world",
        "description": "A Hello, World Terminus command",
        "type": "terminus-plugin",
        "autoload": {
            "psr-4": { "Pantheon\\TerminusHello\\": "src" }
        },
        "require": {
            "organization/project-name": "^1"
        },
        "extra": {
            "terminus": {
                "compatible-version": "^1.1"
            }
        }
        "require-dev": {
            "squizlabs/php_codesniffer": "^2.7"
        },
        "scripts": {
            "install-bats": "if [ ! -f bin/bats ] ; then git clone https://github.com/sstephenson/bats.git; mkdir -p bin; bats/install.sh .; fi",
            "bats": "TERMINUS_PLUGINS_DIR=.. bin/bats tests",
            "cs": "phpcs --standard=PSR2 -n src",
            "cbf": "phpcbf --standard=PSR2 -n src",
            "test": [
                "@install-bats",
                "@bats",
                "@cs"
            ]
        }
    }
    ```

1.  Install the PHP Code Sniffer:

    ```bash
      composer install
    ```

1.  Check the coding standards of your plugin for PSR-2 compliance:

      ```bash
        composer cs
      ```

1.  Use `cbf` to fix (most) PRS-2 compliance errors in your plugin:

      ```bash
        composer cbf
      ```

1. Add the following lines to the `.gitignore`file. This is **strongly** recommended because of the additional files created by these tests.

    ```bash
      vendor
      bats
      bin
      libexec
      share
    ```

1.  Define your Bats tests. Create a folder named `tests`, and create a file named `confirm-install.bats`. Place the content below in your Bats test file:

    ``````bash
    #!/usr/bin/env bats

    #
    # confirm-install.bats
    #
    # Ensure that Terminus and the Composer plugin have been installed correctly
    #

    @test "confirm terminus version" {
      terminus --version
    }

    @test "get help on plugin command" {
      run terminus help MY:PLUGIN-COMMAND
      [[ $output == *"SOME OUTPUT FROM MY PLUGIN HELP"* ]]
      [ "$status" -eq 0 ]
    }
    ```

1. Replace `MY:PLUGIN-COMMAND` with the name of one of your plugin's commands, and replace `SOME OUTPUT FROM MY PLUGIN HELP` in the test.

1.  Run your test:

    ```bash
     composer test
    ```

You can create more files with `.bats` extensions to add more tests. You must populate these files with `@test` blocks as shown above. Tests consist of simple bash expressions. A command that returns a non-zero result code signifies failure. Refer the [documentation on writing BATS tests](https://github.com/sstephenson/bats#writing-tests) for more information.

### Automate Tests

You can [configure your project tests to run automatically on Circle CI](https://circleci.com/docs/1.0/getting-started/). You must keep a Sandbox site online to run the tests against.

1. Copy the contents below into a file named `circle.yml` in your plugin project:

   ```bash
   #
   # Test the Terminus Composer Plugin
   #
   machine:
     timezone:
       America/Chicago
     php:
       version: 7.0.11
     environment:
       PATH: $PATH:~/.composer/vendor/bin:~/.config/composer/vendor/bin:$HOME/bin

   dependencies:
     cache_directories:
       - ~/.composer/cache
     override:
       - composer install --prefer-dist -n
       - composer install-bats
       - composer global require -n "consolidation/cgr"
       - cgr "pantheon-systems/terminus:^1.1"
     post:
       - terminus auth:login --machine-token=$TERMINUS_TOKEN
   test:
     override:
       - composer test
   ```

   You can use another testing service by adapting the contents above. Most popular services should be easy to set up.

1. Open the Circle CI settings to set up the following environment variables:

   - `TERMINUS_SITE`: The name of a Sandbox Pantheon site to run tests against.
   - `TERMINUS_TOKEN`: A [Pantheon machine token](https://docs.pantheon.io/machine-tokens) that has access to the test site.

3. Create an ssh key pair, [add the public key to your account on Pantheon](https://docs.pantheon.io/ssh-keys), and [add the private key to Circle CI](https://circleci.com/docs/1.0/permissions-and-access-during-deployment/). Leave the `Hostname` field empty.

  Your tests should run successfully on Circle CI.

1. Add an [embeddable status badge](https://circleci.com/docs/1.0/status-badges/) to the top of your plugin's `README.md` file to show your passing build status.

A more complete version of the plugin created above can be found at:
[https://github.com/pantheon-systems/terminus-plugin-example](https://github.com/pantheon-systems/terminus-plugin-example)

## Plugin Commands

There is currently no published Plugin API documentation. The best way to learn how to write commands is to look through the internal commands in the Terminus source code: [https://github.com/pantheon-systems/terminus](https://github.com/pantheon-systems/terminus)

## More Resources

- [Extend Terminus with Plugins](https://docs.pantheon.io/terminus/plugins)
- [Terminus Command Reference](https://docs.pantheon.io/terminus/commands)

