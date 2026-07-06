<!--
  Source: Pantheon Systems documentation — Terminus Guide
          https://docs.pantheon.io/terminus
  Verbatim source files (CC BY-SA 4.0) in the pantheon-systems/documentation repo:
    - 02-install.md
    - 10-supported-terminus.md
    - 11-updates.md
    - 13-terminus-4-0.md
    - 12-terminus-3-0.md
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

# Install, Update, Versions


---

## Install and Authenticate (`02-install.md`)

This page provides information on how to install, authenticate, and update Terminus.

## Compatibility and Requirements
Terminus has been tested on the following platforms:

- MacOS
- Windows 10 (WSL 2 Ubuntu 20.0+)
- Ubuntu 20.0 (Including Ubuntu under Docker or VirtualBox)

> **Incompatible Operating Systems**
>
> Terminus does not work with the following platforms:
>
> - Windows 10 – Command Line
> - Windows 10 – Git Bash (MingW)
> - Ubuntu 18.0 and earlier versions
> - Linux system with coreutils equal to or less than 8.28

**Terminus requires the following:**
- PHP Version 8.2 or later
  - You can check your PHP version by running `php -v` from a terminal application.
  - You must have the [php-xml extension](https://secure.php.net/manual/en/dom.setup.php) for:
     - mbstring
     - XML
     - [cURL](https://secure.php.net/manual/en/curl.setup.php)
     - CLI
- [Composer](https://getcomposer.org/download/)
- [Git](https://help.github.com/articles/set-up-git/)
  - This may be needed for the plugin manager component.
- OpenSSH 7.8 or later
  - You can check your OpenSSH version by running `ssh -V` from a terminal application.
  - This package is required for executing nested Drush or WP-CLI commands.

> **Warning: PHP 8.4 and Terminus**
>
> Terminus 3.x is not compatible with PHP 8.4. If you are using PHP <= 8.1 you should use Terminus 3.x.
>
> Terminus 4.x is compatible with PHP 8.2+.

## Installation and Update Methods
### macOS
[Homebrew](https://brew.sh/), a package manager for MacOS, is the recommended installation method for MacOS. As of May 2025, the built-in MacOS version of OpenSSH can cause issues with Terminus if a site being accessed is frozen. For this reason, we recommend installing OpenSSH and Terminus via Homebrew, described below. 

While you can install Terminus using a PHAR as described in the [Windows and Linux section](#windows-and-linux), we still recommend using Homebrew for installing OpenSSH.

1. If you do not have Homebrew installed, follow the instructions on the [Homebrew website](https://brew.sh/).

1. Install OpenSSH via Homebrew by running the command below:

  ```bash
  brew install openssh
  ```

1. Install Terminus by running the command below:

  ```bash
  brew install pantheon-systems/external/terminus
  ```

---

Before upgrading, you may need to trust the Terminus formula. This is a one-time step required by Homebrew for formulas installed from third-party taps — see [Homebrew Tap Trust](https://docs.brew.sh/Tap-Trust) for more information. Without it, `brew upgrade` will silently skip the update.

```bash
brew trust --formula pantheon-systems/external/terminus
```

Then update to the newest version of the [Homebrew installation](#macos) by running:

```bash
brew upgrade terminus
```

### Windows and Linux
Installing Terminus with a PHAR (a stand-alone executable PHP archive) is recommended for Linux and Windows users. This technique is also viable for MacOS users who prefer not to use Homebrew.

> **Note**
>
> [Terminus compatibility](#compatibility-and-requirements) for Windows requires installing the Windows Subsystem for Linux (WSL). [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/) before proceeding to the steps below.

The commands below will:
- Create a `terminus` folder in your home directory (`~/`)
- Get the latest release tag of Terminus
- Download and save the release as `~/terminus/terminus`
- Make the file executable
- Add a symlink to your local `bin` directory for the Terminus executable

#### Terminus 4 (PHP 8.2+)

```bash
mkdir -p ~/terminus && cd ~/terminus
curl -L https://github.com/pantheon-systems/terminus/releases/latest/download/terminus.phar --output terminus
chmod +x terminus
sudo ln -s ~/terminus/terminus /usr/local/bin/terminus
```

#### Terminus 3 (PHP 7.4-8.3)

```bash
mkdir -p ~/terminus && cd ~/terminus
curl -L https://github.com/pantheon-systems/terminus/releases/download/3.6.2/terminus.phar --output terminus3
chmod +x terminus3
sudo ln -s ~/terminus/terminus3 /usr/local/bin/terminus
```

Update the [standalone Terminus PHAR](#windows-and-linux) installation to the newest version by running the command below:

```bash
terminus self:update --compatible
```

## Authentication
### Login via Machine Token (Required)
You must log in with a machine token after the installation completes. A machine token is used to securely authenticate your machine. Machine tokens provide the same access as your username and password, and do not expire. Refer to [Machine Tokens](https://docs.pantheon.io/machine-tokens/) for more information.

1. [Go to your Personal Settings](https://docs.pantheon.io/personal-settings), select [Machine Tokens](https://dashboard.pantheon.io/users/#account/tokens/), then [Generate a Machine Token](https://dashboard.pantheon.io/login?destination=%2Fuser#account/tokens/create/terminus/).

1. Use your machine token to authenticate into Terminus, replacing `<email@example.com>` and `<machine_token>`:

  ```bash
  terminus auth:login --email=<email@example.com> --machine-token=<machine_token>
  ```

Machine tokens are keyed to the email address associated with your Pantheon user account. Future sessions are authenticated with your email address after a token has been used to authenticate Terminus:

```bash
terminus auth:login --email <email@example.com>
```

### SSH Authentication (Optional, but recommended)

Commands that execute remote instructions to tools like Drush or WP-CLI require SSH authentication. Refer to [Generate and Add SSH Keys](https://docs.pantheon.io/ssh-keys/) to prevent password requests when executing these commands.


---

## Supported Terminus and PHP Versions (`10-supported-terminus.md`)

Each major and minor version of Terminus is fully supported for one year from the release of the subsequent version. During the supported period, serious bugs and security issues that have been reported are fixed in patch releases. Refer to the documentation on [Semantic Versioning](https://semver.org/) for more information on versioning.

After this period, the version will reach End Of Life (**EOL**), and will no longer be supported. We recommend you update Terminus far in advance of the EOL schedule, so that regressions in new versions can be reported and patched in time.

| Version          | Release Date       | EOL Date           |
|------------------|--------------------|--------------------|
| 4.3.2            | June 23, 2026      |                    |
| 4.3.1            | June 02, 2026      | June 23, 2027      |
| 4.3.0            | May 26, 2026       | June 02, 2027      |
| 4.2.2            | May 13, 2026       | May 26, 2027       |
| 4.2.1            | April 30, 2026     | May 13, 2027       |
| 4.2.0            | April 13, 2026     | April 30, 2027     |
| 4.1.9            | April 08, 2026     | April 13, 2027     |
| 4.1.8            | March 30, 2026     | April 08, 2027     |
| 4.1.7            | March 23, 2026     | March 30, 2027     |
| 4.1.6            | March 18, 2026     | March 23, 2027     |
| 4.1.4            | February 02, 2026  | March 18, 2027     |
| 4.1.3            | January 29, 2026   | February 02, 2027  |
| 4.1.1            | November 04, 2025  | January 29, 2027   |
| 4.1.0            | September 29, 2025 | November 04, 2026  |
| 4.0.3            | September 11, 2025 | September 29, 2026 |
| 4.0.2            | September 05, 2025 | September 11, 2026 |
| 4.0.1            | May 19, 2025       | September 05, 2026 |
| 4.0.0            | May 07, 2025       | May 19, 2026       |
| 3.6.2            | March 03, 2025     | May 07, 2026       |
| 3.6.1            | December 05, 2024  | March 03, 2026     |
| 3.6.0            | September 19, 2024 | December 05, 2025  |
| 3.5.2            | August 19, 2024    | September 19, 2025 |
| 3.5.1 or earlier | June 13, 2024      | August 19, 2025    |

### PHP Version Compatibility Matrix

| PHP Version |            Terminus 4.x            |
| ---------- |:----------------------------------:|
| 8.5 | ✔ |
| 8.4 | ✔ |
| 8.3 | ✔ |
| 8.2 | ✔ |
| 8.1 or earlier |                 ❌                  |

## More Resources

- [PHP on Pantheon](https://docs.pantheon.io/guides/php)
- [Update Terminus](https://docs.pantheon.io/terminus/updates)


---

## What's New in Terminus 4.0 (`13-terminus-4-0.md`)

This section provides information about Terminus 4.0. Terminus 4.0 is the most recent major version of Terminus and is recommended in place of Terminus 3.x.

> **Note**
>
> We suggest you read from the beginning of the [Terminus Guide](https://docs.pantheon.io/terminus) if you're not already familiar with Terminus. This section is specifically geared at existing Terminus users who need to update existing implementations.

These commands or their output have changed in a significant way that may affect your existing scripting of Terminus.

## Removed Commands
The following commands were removed from Terminus 4.0:
- `service-level:set`: Replaced with `plan:set` since Terminus 2.x

## New Commands
- No new commands have been added in Terminus 4.0.

## Additional Changes
- Removed `getOrgMemberships` function from `OrganizationsTrait`: `getOrganizationMemberships` should be used instead.
- Removed `checkProgress` function from `Workflow` model: `WorkflowProcessingTrait` should be used instead.
- Removed `operations` function from `Workflow` model: `getOperations()->all()` should be used instead.
- Removed `getSite(string $site_id)` function from `SiteAwareTrait`: `getSiteById` should be used instead.
- Removed `getOptionalSiteEnv` function from `SiteAwareTrait`: `getOptionalEnv` should be used instead.
- Removed `getUnfrozenSiteEnv` function from `SiteAwareTrait`: `requireSiteIsNotFrozen` should be used instead.
- When in interactive mode, if a command is missing a required argument, it will be interactively prompted.
- Support for some EOL versions of PHP have been removed from Terminus 4. PHP 8.2 or later is required.

## More Resources

- [Terminus on GitHub](https://github.com/pantheon-systems/terminus)
- [Terminus Guide](https://docs.pantheon.io/terminus)
- [Terminus PHP Compatibility](https://docs.pantheon.io/terminus/supported-terminus#php-version-compatibility-matrix)


---

## What's New in Terminus 3.0 (historical) (`12-terminus-3-0.md`)

This section provides information about Terminus 3.0. Terminus 3.0 is the most recent major version of Terminus and is recommended in place of Terminus 2.0.

> **Note**
>
> We suggest you read from the beginning of the [Terminus Guide](https://docs.pantheon.io/terminus) if you're not already familiar with Terminus. This section is specifically geared at existing Terminus users who need to update existing implementations.

These commands or their output have changed in a significant way that may affect your existing scripting of Terminus.

## Deprecated Commands
No commands were deprecated in the Terminus 3.0 release.

## New Commands
The following commands are new to Terminus as of version 3.0:
- `self:plugin:install`: Install Terminus plugins.
- `self:plugin:list`: List installed Terminus plugins.
- `self:plugin:search` Find Terminus plugins on Packagist.
- `self:plugin:uninstall` Uninstall Terminus plugins.
- `self:plugin:update` Update already-installed Terminus plugins.

## Additional Changes
- Support for EOL versions of PHP have been removed from Terminus 3. PHP 7.4 or later is required.

## More Resources

- [Terminus on GitHub](https://github.com/pantheon-systems/terminus)
- [Terminus Guide](https://docs.pantheon.io/terminus)
- [Terminus PHP Compatibility](https://docs.pantheon.io/terminus/supported-terminus#php-version-compatibility-matrix)


---

## Changelog / Releases (`11-updates.md`)

## Changelog

_Releases are auto-generated. See the live changelog: <https://docs.pantheon.io/terminus/updates> and GitHub releases at <https://github.com/pantheon-systems/terminus/releases>._

## More Resources

- [Terminus Command Reference](https://docs.pantheon.io/terminus/commands)
- [Terminus 4.0](https://docs.pantheon.io/terminus/updates)

