# Nightwatch Chef

> Creates a development environment with minimal effort, using only a single command!

## Vagrant/Chef Roadmap

- [x] Install Node.js
  - [x] Install v8 LTS
  - [x] Update to v10 LTS
  - [ ] Update to v12 LTS
- [x] Install PostgreSQL
  - [x] Create database for unit tests
- [x] Install Redis
- [x] Install Yarn for dependency management
- [x] Start projects on `vagrant up`
  - [x] Start API
  - [x] Start bot after API starts
  - [x] Start web server to host web interface
- [ ] Change working directory to `/opt/nightwatch` (where the project lives in the VM) when the user connects to the VM via SSH

## Prerequisites

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Chef Development Kit](https://downloads.chef.io/chefdk/)
- [Vagrant](https://www.vagrantup.com/downloads.html)
- Vagrant Berkshelf plugin: `vagrant plugin install vagrant-berkshelf`

Windows users may run into issues getting Vagrant and the VM to work properly.
Please do not create a bug report if the VM does not start, because the issue is on your host machine, not within our setup scripts.

The most common causes of any issues here are the user's firewall and not using an elevated terminal.

If you can't get it to work, join our [Discord server](https://invite.gg/welounge) and I will help you get it working.

## Getting Started

Once you clone the repo and have all prerequisites met, open a terminal. If you are using Windows, you must run the terminal as an adminstrator.

Then run `vagrant up`. The first time you run the command, it will install a virtual machine (Ubuntu), then install everything needed to run the API, bot, and web interface. Once everything is installed, the API, bot, and web interface will start automatically inside the VM.

The VM uses the IP address `192.168.33.10`, and each application uses a port within that IP.

- To access the API, you would use `192.168.33.10:4000/api`
- The web interface can be accessed at `192.168.33.10:8080`
- The bot also runs inside the VM, but cannot be accessed via web browser

## Must-Know Commands

- `vagrant up`: starts the VM. The first time the command is run, the VM will have to download, and will be provisioned.
  - You can force it to provision with `vagrant up --provision`
- `vagrant halt`: Stops the VM.
- `vagrant reload`: Restarts the VM.
  - You can force it to provision with `vagrant reload --provision`
- `vagrant destroy`: Resets the VM to the base image.

## Known Issues/Limitations

- Windows users must start the Vagrant box in an escalated terminal, or Yarn/NPM will throw symlink errors.
- Provisioning the VM multiple times may error. If this occurs, just provision it again to fix it.
