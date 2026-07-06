<!--
  Source: Pantheon Systems documentation — Terminus Guide
          https://docs.pantheon.io/terminus
  Verbatim source files (CC BY-SA 4.0) in the pantheon-systems/documentation repo:
    - 04-commands.md
    - 09-configuration.md
    - 06-plugins.md
    - 08-directory.md
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

# Commands, Configuration & Plugins


---

## Command Directory (`04-commands.md`)

This section provides a comprehensive list of Terminus commands.

> **Note**
>
> If you would like additional information for a specific Terminus command (for example, available `--format` options) run the command with the `--help` flag in your terminal.

## Command Structure

### Basic Format

The basic format of a Terminus command is:

```bash
terminus command:subcommand <site>.<env>
```

Read below for a complete list of Terminus commands, or use the search box to look up a specific command.

The table below is the complete command set, generated from `terminus list --raw` on Terminus 4.3.x — this is exactly what the docs' `<Commands />` component renders. Run any command with `--help` for its arguments, options, and available `--format` values.

| Command | Description |
|---------|-------------|
| `aliases` | Generates Pantheon Drush aliases for sites on which the currently logged-in user is on the team. Note that Drush 9 does not read alias files from global locations. You must set valid alias locations in your drush.yml file. Refer to https://docs.pantheon.io/guides/drush/drush-aliases#manage-available-site-aliases-lists for more information. |
| `art` | Displays Pantheon ASCII artwork. |
| `completion` | Dump the shell completion script |
| `help` | Display help for a command |
| `list` | List commands |
| `art:list` | Lists available Pantheon ASCII artwork. |
| `auth:login` | Logs in a user to Pantheon. |
| `auth:logout` | Logs out the currently logged-in user and deletes any saved machine tokens. |
| `auth:whoami` | Displays information about the currently logged-in user. |
| `backup:automatic:disable` | Disables automatic backups. |
| `backup:automatic:enable` | Enables automatic daily backups that are retained for one week and weekly backups retained for one month. |
| `backup:automatic:info` | Displays the hour when daily backups are created and the day of the week when weekly backups are created. |
| `backup:create` | Creates a backup of a specific site and environment. |
| `backup:get` | Displays the download URL for a specific backup or latest backup. |
| `backup:info` | Displays information about a specific backup or the latest backup. |
| `backup:list` | Lists backups for a specific site and environment. |
| `backup:restore` | Restores a specific backup or the latest backup. |
| `branch:list` | Displays list of git branches for a site. |
| `connection:info` | Displays connection information for Git, SFTP, MySQL, and Redis. |
| `connection:set` | Sets Git or SFTP connection mode on a development environment (excludes Test and Live). |
| `dashboard:view` | Displays the URL for the Pantheon Dashboard or opens the Dashboard in a browser. |
| `domain:add` | Associates a domain with the environment. |
| `domain:dns` | Displays recommended DNS settings for the environment. |
| `domain:list` | Displays domains associated with the environment. |
| `domain:lookup` | Displays site and environment with which a given domain is associated. Note: Only sites for which the user is authorized will appear. |
| `domain:primary:add` | Sets a domain associated to the environment as primary, causing all traffic to redirect to it. |
| `domain:primary:remove` | Removes the primary designation from the primary domain in the site and environment. |
| `domain:remove` | Disassociates a domain from the environment. |
| `domain:verify` | Verifies ownership of a domain attached to an environment. |
| `env:clear-cache` | Clears caches for the environment. |
| `env:clone-content` | Clones database/files from one environment to another environment. WordPress sites will search the database for the default domain and replace it with the target environment's domain unless you specify a different search/replace string with --from-url and --to-url. |
| `env:code-log` | Displays the code log for the environment. |
| `env:code-rebuild` | Moves code to the specified environment's runtime from the associated git branch, retriggering Composer builds for sites using Integrated Composer. (Not applicable for Test and Live environments which run on git tags made from the Dev environment's git history.) |
| `env:commit` | Commits code changes on a development environment. Note: The environment connection mode must be set to SFTP. |
| `env:deploy` | Deploys code to the Test or Live environment. Notes: - Deploying the Test environment will deploy code from the Dev environment. - Deploying the Live environment will deploy code from the Test environment. |
| `env:diffstat` | Displays the diff of uncommitted code changes on a development environment. |
| `env:info` | Displays environment status and configuration. |
| `env:list` | Displays a list of the site environments. |
| `env:metrics` | Displays the pages served and unique visit metrics for the specified site environment. The most recent data up to the current day is returned. |
| `env:rotate-random-seed` | Rotate random seed for the environment. |
| `env:view` | Displays the URL for the environment or opens the environment in a browser. |
| `env:wake` | Wakes the environment by pinging it. Note: Development environments and Sandbox sites will automatically sleep after a period of inactivity. |
| `env:wipe` | Deletes all files and database content in the environment. |
| `github:vcs` | Pushes GitHub VCS event to the VCS API. |
| `https:info` | Provides information for HTTPS on being used for the environment. |
| `https:remove` | Disables HTTPS and removes the SSL certificate from the environment. |
| `https:set` | Enables HTTPS and/or updates the SSL certificate for the environment. |
| `import:complete` | Finalizes the Pantheon import process. |
| `import:database` | Imports a database archive to the environment. This command drops the existing database and imports the target into a new database. Use with caution to avoid accidental database deletion. |
| `import:files` | Imports a file archive to the environment. |
| `import:site` | Imports a site archive (code, database, and files) to the site. |
| `local:clone` | CLone a copy of the site code into $HOME/pantheon-local-copies |
| `local:commitAndPush` | Commit local changes to remote repository. |
| `local:dockerize` | Create new backup of your live site db and download to $HOME/pantheon-local-copies/{Site}/db |
| `local:getLiveDB` | Create new backup of your live site db and download to $HOME/pantheon-local-copies/db |
| `local:getLiveFiles` | Create new backup of your live site FILES folder and download to $HOME/pantheon-local-copies/files |
| `lock:disable` | Disables HTTP basic authentication on the environment. |
| `lock:enable` | Enables HTTP basic authentication on the environment. Note: HTTP basic authentication username and password are stored in plaintext. |
| `lock:info` | Displays HTTP basic authentication status and configuration for the environment. |
| `machine-token:delete` | Deletes a currently logged-in user machine token. |
| `machine-token:delete-all` | Delete all stored machine tokens and log out. |
| `machine-token:list` | Lists the currently logged-in user machine tokens. |
| `multidev:create` | Creates a multidev environment. If there is an existing Git branch with the multidev name, then it will be used when the new environment is created. |
| `multidev:delete` | Deletes a Multidev environment. |
| `multidev:list` | Lists a site Multidev environments. |
| `multidev:merge-from-dev` | Merges code commits from the Dev environment into a Multidev environment. |
| `multidev:merge-to-dev` | Merges code commits from a Multidev environment into the Dev environment. |
| `new-relic:disable` | Disables New Relic for a site. |
| `new-relic:enable` | Enables New Relic for a site. |
| `new-relic:info` | Displays New Relic configuration. |
| `node:builds:list` | List builds and their deployment status for a site environment. |
| `node:builds:rebuild` | Rebuilds code for a Node.js site environment, optionally from a specific commit. |
| `node:builds:rollback` | Rolls back a deployed build on a Node.js site environment. |
| `node:builds:wait` | Wait for a Node.js site build and deployment to complete. |
| `node:logs:build:get` | Print the build log. |
| `node:logs:runtime:get` | Print the run time log for last 24 hours. |
| `org:info` | Displays information about an organization. |
| `org:list` | Displays the list of organizations. |
| `org:people:add` | Adds a user to an organization. |
| `org:people:list` | Displays the list of users associated with an organization. |
| `org:people:remove` | Removes a user from an organization. |
| `org:people:role` | Changes a user role within an organization. |
| `org:site:list` | Displays the list of sites associated with an organization. |
| `org:site:remove` | Removes a site from an organization. |
| `org:upstream:list` | Displays the list of upstreams belonging to an organization. |
| `owner:set` | Change the owner of a site |
| `payment-method:add` | Associates an existing payment method with a site. |
| `payment-method:list` | Displays the list of payment methods for the currently logged-in user. |
| `payment-method:remove` | Disassociates the active payment method from a site. |
| `plan:info` | Displays information about a site plan. |
| `plan:list` | Displays the list of available site plans. |
| `plan:set` | Changes a site plan. |
| `redis:disable` | Disables Redis add-on for a site. |
| `redis:enable` | Enables Redis add-on for a site. |
| `remote:drush` | Runs a Drush command remotely on a site environment. |
| `remote:wp` | Runs a WP-CLI command remotely on a site environment. |
| `search:disable` | Disables search indexing add-on for a site. |
| `search:enable` | Enables search indexing add-on for a site. |
| `secret:org:delete` | Delete given secret for a specific org. |
| `secret:org:list` | Lists secrets for a specific org. |
| `secret:org:set` | Set secret for a specific org. |
| `secret:site:delete` | Delete given secret for a specific site. |
| `secret:site:list` | Lists secrets for a specific site. |
| `secret:site:local-generate` | Generate json file for usage in local environment. |
| `secret:site:set` | Set secret for a specific site. |
| `self:clear-cache` | Clears the local Terminus command cache. |
| `self:config:dump` | Displays the local Terminus configuration. |
| `self:console` | Opens an interactive PHP console within Terminus. Note: This functionality is useful for debugging Terminus or prototyping Terminus plugins. |
| `self:info` | Displays the local PHP and Terminus environment configuration. |
| `self:plugin:create` | Create a new terminus plugin. |
| `self:plugin:install` | Install one or more Terminus plugins. |
| `self:plugin:list` | List all installed Terminus plugins. |
| `self:plugin:migrate` | Migrate Terminus 2 plugins. |
| `self:plugin:reload` | Reload Terminus plugins. |
| `self:plugin:search` | Search for available Terminus plugins. |
| `self:plugin:uninstall` | Remove one or more Terminus plugins. |
| `self:plugin:update` | Update one or more Terminus plugins. |
| `self:update` | Updates Terminus to the latest version. |
| `site:create` | Creates a new site |
| `site:delete` | Deletes a site from Pantheon. |
| `site:info` | Displays a site information. |
| `site:label:set` | Changes the site label |
| `site:list` | Displays the list of sites accessible to the currently logged-in user. |
| `site:lookup` | Displays the UUID of a site given its name. |
| `site:org:add` | Associates a supporting organization with a site. |
| `site:org:list` | Displays the list of supporting organizations associated with a site. |
| `site:org:remove` | Disassociates a supporting organization from a site. |
| `site:pause-builds` | Pauses build for a given site |
| `site:resume-builds` | Resumes build for a given site |
| `site:team:add` | Adds a user to a site team. Note: An invite will be sent if the email is not associated with a Pantheon account. |
| `site:team:list` | Displays the list of team members for a site. |
| `site:team:remove` | Removes a user from a site team. |
| `site:team:role` | Updates a user role on a site team. |
| `site:upstream:clear-cache` | Clears caches for the site codeserver. |
| `site:upstream:set` | Changes a site upstream. |
| `solr:disable` | Disables Solr add-on for a site. |
| `solr:enable` | Enables Solr add-on for a site. |
| `ssh-key:add` | Associates a SSH public key with the currently logged-in user. |
| `ssh-key:list` | Displays the list of SSH public keys associated with the currently logged-in user. |
| `ssh-key:remove` | Disassociates a SSH public key from the currently logged-in user. |
| `tag:add` | Adds a tag on a site within an organization. |
| `tag:list` | Displays the list of tags for a site within an organization. |
| `tag:remove` | Removes a tag from a site within an organization. |
| `upstream:info` | Displays information about an upstream. |
| `upstream:list` | Displays the list of upstreams accessible to the currently logged-in user. |
| `upstream:updates:apply` | Applies upstream updates to a site development environment. |
| `upstream:updates:list` | Displays a cached list of new code commits available from the upstream for a site development environment. Note: To refresh the cache you will need to run site:upstream:clear-cache before running this command. |
| `upstream:updates:status` | Displays a whether there are updates available from the upstream for a site environment. |
| `vcs:connection:add` | Registers a GitHub App installation with the VCS API. |
| `vcs:connection:link` | Links an existing VCS organization to a new Pantheon organization. |
| `vcs:connection:list` | Lists connected VCS installations from the VCS API. |
| `vcs:github-host:add` | Register a GitHub Enterprise Server instance with Pantheon. |
| `workflow:info:logs` | Displays the details of Quicksilver operation logs. |
| `workflow:info:operations` | Displays Quicksilver operation details of a workflow. |
| `workflow:info:status` | Displays the status of a workflow. |
| `workflow:list` | Displays the list of the workflows for a site. |
| `workflow:wait` | Wait for a workflow to complete. Usually this will be used to wait for code commits, since Terminus will already wait for workflows that it starts through the API. |
| `workflow:watch` | Streams new and finished workflows from a site to the console. |



---

## Configuration File (`~/.terminus/config.yml`) (`09-configuration.md`)

This section provides information on how to configure your local Terminus configuration file.

You can create a configuration file to provide default values for common options. This helps avoid passing the same options to Terminus repeatedly. The Terminus configuration file is located at `$HOME/.terminus/config.yml`.

## Available Configurations

Any command variable normally passed in the form of `--option=VALUE` is configurable. Stored values are available regardless of which alias you use to run the command. Default values stored this way are overridden by those supplied on the command line.

Run the `--help` option in your terminal for a list of available options for a given command (e.g., available `--fields` or `--format` options):

![Terminus Help Command Example](https://raw.githubusercontent.com/pantheon-systems/documentation/main/src/source/images/terminus-help-example.png)

### Example

The `$HOME/.terminus/config.yml` file uses YAML formatting, which relies on indentation in the form of two spaces per indent:

```yaml:title=config.yml
hide_git_mode_warning: 1
command:
  auth:
    login:
      options:
        email: anita@example.com
  site:
    pancakes:
      options:
        app: sequelace
```

The example above does three things:

- Terminus warns you when running commands in an environment set to Git mode, unaware if the command affects the codebase or not.

- The `terminus auth:login` command automatically provides the correct email address when it runs. This is useful if you find yourself logging in to multiple accounts frequently, and want to use your regular account by default.

  ```none
  [warning] This environment is in read-only Git mode. If you want to make changes to the codebase of this site (e.g. updating modules or plugins), you will need to toggle into read/write SFTP mode first.
  ```

  Defining `TERMINUS_HIDE_GIT_MODE_WARNING` disables that message, which is useful for those using Terminus for frequent changes to files, not code. (Refer to [Use the Pantheon WebOps Workflow](https://docs.pantheon.io/pantheon-workflow) for more information on Code versus Content.)

- The Terminus Plugin [Pancakes](https://github.com/terminus-plugin-project/terminus-pancakes-plugin) lets you open your Pantheon site database with a SQL GUI client. Rather than define the app every time. This configuration always uses [Sequel Ace](https://sequel-ace.com/) unless otherwise specified.

## More Resources

- [Pantheon YAML Configuration Files](https://docs.pantheon.io/pantheon-yml)
- [Pantheon WebOps Workflow](https://docs.pantheon.io/pantheon-workflow)


---

## Install, Update & Uninstall Plugins (`06-plugins.md`)

This section provides information on how to install plugins with Terminus, and how to add new commands through third-party plugins.

## Install Plugins

Terminus ships with a plugin manager. You can use a Terminus command like the example below to install a plugin:

```bash
terminus self:plugin:install pantheon-systems/terminus-plugin-example
```

You can also pass a path to the install command and it will install the plugin from that folder.

## Update Plugins

Terminus ships with a plugin manager. You can use a Terminus command like the example below to update a plugin:

```bash
terminus self:plugin:update pantheon-systems/terminus-plugin-example
```

## Uninstall Plugins

Terminus ships with a plugin manager. You can use a Terminus command like the example below to uninstall a plugin:

```bash
terminus self:plugin:uninstall pantheon-systems/terminus-plugin-example
```

## More Resources

- [WordPress Plugins and Themes with Known Issues](https://docs.pantheon.io/wordpress-known-issues)
- [Drupal Modules with Known Issues](https://docs.pantheon.io/modules-known-issues)


---

## Plugin Directory (`08-directory.md`)

You can extend Terminus functionality and add commands by installing [third-party plugins](https://github.com/terminus-plugin-project) or by [creating your own plugins](https://docs.pantheon.io/terminus/create).

The list below provides a small sample of popular plugins available for Terminus:

| Plugin | Official | Author | Description |
|--------|:--------:|--------|-------------|
| [Autopilot](https://github.com/pantheon-systems/terminus-autopilot-plugin#readme) | Yes | Tom Stovall | Manage [Autopilot](https://docs.pantheon.io/guides/autopilot) functions from the command line with the Terminus Autopilot plugin. |
| [Build Tools](https://github.com/pantheon-systems/terminus-build-tools-plugin) | Yes | Greg Anderson | Create a [GitHub](https://github.com) PR Workflow to test Pantheon sites on [CircleCI](https://circleci.com/) (or other CI services). |
| [Carbon](https://github.com/pantheon-systems/terminus-carbon-plugin) | Yes | Kyle Taylor | Fetch carbon impact and other sustainability data on your Pantheon sites. |
| [Composer](https://github.com/pantheon-systems/terminus-composer-plugin) | Yes | Brian Thompson | Run [Composer](https://getcomposer.org/) commands on Pantheon sites. |
| [Filer](https://github.com/terminus-plugin-project/terminus-filer-plugin) |  | Sean Dietrich | Open SFTP Connections to your Pantheon Sites. |
| [Mass Update](https://github.com/pantheon-systems/terminus-mass-update) | Yes | Ronan Dowling | Apply upstream updates to a list of sites. |
| [Pancakes](https://github.com/terminus-plugin-project/terminus-pancakes-plugin) |  | Dave Wikoff | Open Pantheon Site Databases in your favorite SQL Client. |
| [Quicksilver](https://github.com/pantheon-systems/terminus-quicksilver-plugin) | Yes | Greg Anderson | Install [Quicksilver](https://docs.pantheon.io/guides/quicksilver) webhooks from the [Quicksilver examples](https://github.com/pantheon-systems/quicksilver-examples), or a personal collection. |
| [Rsync](https://github.com/pantheon-systems/terminus-rsync-plugin) | Yes | Greg Anderson | Copy files to and from a Pantheon site. |
| [Secrets](https://github.com/pantheon-systems/terminus-secrets-plugin) | Yes | Greg Anderson | Manage the `secrets.json` file for use with Quicksilver. |
| [Site Clone](https://github.com/pantheon-systems/terminus-site-clone-plugin) | Yes | Andrew Taylor | Copy the code, database, and files from one Pantheon Site Dashboard to another. |
| [Site Status](https://github.com/terminus-plugin-project/terminus-site-status-plugin) |  | Ed Reel | Display the status of all available Pantheon site environments. |

