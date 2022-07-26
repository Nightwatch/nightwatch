<p align="center"><img width="55%" src="./img/nightwatch.png"/></p>
<p align="center"><img width="55%" src="./img/slogan.png"/></p>

<p align="center">All-in-one Discord bot including a web interface and its own mobile app!</p>
<p align="center"><a href="https://discordapp.com/api/oauth2/authorize?client_id=465260354126086144&permissions=8&scope=bot">Invite me</a>&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;<a href="https://invite.gg/nightwatch">Join my server</a></p>

<br/>

## Features

Nightwatch aims to combine the features of all popular bots into one bot.

Features include:

- Moderation
- Anti spam **Ƥ**
- Anti raid **Ƥ**
- Anti nuke **Ƥ**
- Auto purge **Ƥ**
- Music **Ƥ**
- Games
- Economy
- Gambling
- Giveaways
- Levels **Ƥ**
- Lockdown **Ƥ**
- Referral rewards
- Self assignable roles
- Slow mode **Ƥ**
- Suggestions
- Support tickets
- Polls
- Custom welcome messages
- Event logging
- Reddit Artificial Intelligence **Ƥ**
- Custom Social Media/Friend system **Ƥ**
- Image/Game/Music/Anime/etc search
- Server linking **Ƥ**
- Voice/Text linking **Ƥ**
- Plugins
- Integration with other services
- REST API for third party integration
- Beautiful web interface
- Custom user/role/permission system
- Cross-platform mobile app
- ...And much more

Want other features added? Let us know by making a [Feature Request](https://github.com/Nightwatch/nightwatch/issues)

Please note that all listed features may not be implemented yet. This list mainly serves as a roadmap.

_Features marked with **Ƥ** require Nightwatch Premium_

## Nightwatch Premium

Want to unlock Nightwatch Premium and get access to some cool commands and features?

**Get Premium: https://patreon.com/tgoins**

Benefits of Premium:

- Works in *all* Discord servers you are the owner of!
- Unlocks all features marked with **Ƥ**
- Premium commands can be used in all servers, regardless of whether the server owner has Premium
- Priority support
- Early access to new features
- Exclusive role in the [Nightwatch Discord](https://invite.gg/nightwatch)

## Help Wanted!

Nightwatch is looking for contributors.

There are two ways you can contribute:

- Indirect contribution: Creating issues in GitHub that we can address (Feature requests, bug reports, etc.).
- Direct contribution: Submitting pull requests to add functionality or improve the codebase.

If you want to indirectly contribute, feel free! Just follow the community guidelines, and try to follow the issue templates.

 If you would like to directly contribute to Nightwatch:

1. Join the [Nightwatch Discord](https://invite.gg/nightwatch)
2. Claim a Contributor role with `n.iam Contributor` to get access to a channel for discussing Nightwatch development.
3. Fork the repo.
4. Point all pull requests to the `develop` branch.

## Contact Us

Want to talk about my bot, have questions about it, or just want to chat?

Come visit [my Discord server](https://invite.gg/nightwatch). I'd be happy to talk to you.

See the bot in action, test it out, see what it can do for you.

## Donate

If you appreciate what we do and want to support the development of this project, please consider donating. https://liberapay.com/ihaxjoker/donate

If you would like to support us without spending money, give the repo a star. We value those as well!

Whether you donate or star, we appreciate your support.

## Installation

You are more than welcome to self-host the bot! Please be aware that no Premium features are included in the repo.

The only supported installation method for the bot is Docker. You may use other methods and tools to setup the bot locally, but I will only assist you with issues if you are using the supported method.

### Prerequisites

- Docker
- Yarn

### Setup

1. Clone the repo
2. In the `config` directory, duplicate the `config.example.json` and name it `config.json`
3. Edit the file and fill in the values. Remove any comments
    - Any field with a default value does not have to be modified!
    - Only the `bot` and `api` sections are required; anything outside of those sections are optional
    - Obtain a bot token from [here](https://discordapp.com/developers/applications/). You'll have to create a bot if you haven't already
4. Repeat the same process as above for the `ormconfig.example.json` file
5. Copy and rename the `docker.compose.yml.example` file. You don't need to update any values, but I would suggest changing the environment variables.
6. Run Docker Compose with the command `docker-compose up`
7. Invite the bot to your server

Optional: Build the web interface with `yarn web:prod`
or run it on a development server with `yarn web:start`

### Updating the bot

When changes are made to the bot, you need to restart the Docker container for the changes to work.

1. Kill the docker container by pressing Ctrl+C twice
2. Pull the changes by running `git pull` if you haven't already
3. Start the Docker container again using `docker-compose up`

## Background

Nightwatch started as a tiny bot for a single Discord server. Over the years, it has transformed and scaled to work in any server. It has been through several rewrites, and has evolved in performance, functionality, and design.

### Why was this bot created?

I created this bot to eliminate how many bots you use in your server. Having several bots makes your server look unprofessional and gives users the feeling that the bots are the only good thing about the server.

I wanted to make a bot that combines all the popular features from the other bots into a single bot. Bots should compliment your server, not control it.

Lastly, I wanted to introduce a bot that was professionally designed, using enterprise design patterns and a highly scalable architecture. Compared to other bots, Nightwatch is built for scale with industry standards to back its design. It was intended to be a commercial application, but was open sourced to show off its clean code and prove its abilities.

## Contribute

Any developer is allowed to contribute. Fork the repo, make some changes (e.g. add features, fix bugs, etc.) and make a Pull Request to the **develop** branch.
If approved, we will merge your changes, and you will be added as a contributor!

We are open for suggestions, and want the end-product to be awesome. If you have an idea, please share it.

## Support

If there are any questions or issues, please make a ticket in GitHub and we will respond as soon as we can. <https://github.com/Nightwatch/nightwatch/issues>
