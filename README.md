<p align="center"><img width="55%" src="./img/nightwatch.png"/></p>
<p align="center"><img width="55%" src="./img/slogan.png"/></p>

<p align="center"> All-in-one Discord bot including a web interface and its own mobile app!</p>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![Build Status](https://travis-ci.com/Nightwatch/nightwatch.svg?branch=master)](https://travis-ci.com/Nightwatch/nightwatch)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![GitHub Issues](https://img.shields.io/github/issues/Nightwatch/nightwatch.svg)](https://github.com/Nightwatch/Nightwatch/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](https://opensource.org/licenses/GPL-3.0)

## Features

Nightwatch aims to combine the features of all popular bots into one bot.

Features include:

- Moderation
- Music
- Games
- Economy
- Gambling
- Giveaways
- Referral rewards
- Self assignable roles
- Suggestions
- Support tickets
- Polls
- Custom Social Media/Friend system
- Image/Game/Music/Anime/etc search
- Server linking
- Plugins
- Integration with other services
- REST API for third party integration
- Beautiful web interface
- Custom user/role/permission system
- Cross-platform mobile app
- ...And much more

Want other features added? Let us know by making a [Feature Request](https://github.com/Nightwatch/nightwatch/issues)

Please note that all listed features may not be implemented yet. This list mainly serves as a roadmap.

## Nightwatch Premium

Want to unlock Nightwatch Premium and get access to some cool commands and features?

Get Premium: https://patreon.com/ihaxjoker

## Contact Us

Want to talk about my bot, have questions about it, or just want to chat?

Come visit [my Discord server](https://invite.gg/nightwatch). I'd be happy to talk to you.

See the bot in action, test it out, see what it can do for you.

## Donate

If you appreciate what we do and want to support the development of this project, please consider donating. https://liberapay.com/ihaxjoker/donate

If you would like to support us without spending money, give the repo a star. We value those as well!

Whether you donate or star, we appreciate your support.

## Installation

### Prerequisites

- Node.js >= v10 LTS
- PostgreSQL
- Redis
- An HTTP server for the web interface
- (optional) Yarn

### Setup

1. Clone the repo
2. Inside the repo, run `npm install`, or `yarn` if you are using Yarn
3. In the `config` directory, duplicate the `config.example.json` and name it `config.json`
4. Edit the file and fill in the values. Remove any comments
    - Any field with a default value does not have to be modified!
    - Only the `bot`, `api`, and `db` sections are required; anything outside of those sections are optional
    - Obtain a bot token from [here](https://discordapp.com/developers/applications/). You'll have to create a bot if you haven't already
5. Create a database in PostgreSQL for the bot
6. Start the API with `npm run api:start` or `yarn api:start`
7. Start the bot with `npm run bot:start` or `yarn bot:start`
8. Build the web interface with `npm run web:prod` or `yarn web:prod`
    - Or run it on a development server with `npm run web:start` or `yarn web:start`
9. Invite the bot to your server

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
