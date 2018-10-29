# Nightwatch Chef

> Creates a development environment with minimal effort.

## Vagrant/Chef Roadmap

- [ ] Install Node.js
  - [x] Install v8 LTS
  - [ ] Update to latest v10 LTS
- [x] Install PostgreSQL
  - [x] Create database for unit tests
- [ ] Install MongoDB
- [ ] Install Redis
- [x] Install Yarn for dependency management
- [ ] Start projects on `vagrant up`
  - [x] Start API with pm2
  - [ ] Start bot after API starts
  - [ ] Start web server to host web interface
- [ ] Change working directory to `/vagrant` (where the project lives in the VM) when the user connects to the VM via SSH

## Prerequisites

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Chef Development Kit](https://downloads.chef.io/chefdk/)
- [Vagrant](https://www.vagrantup.com/downloads.html)
- Vagrant Berkshelf plugin: `vagrant plugin install vagrant-berkshelf`

## Must-Know Commands

- `vagrant up`: starts the VM. The first time the command is run, the VM will have to download, and will be provisioned.
  - You can force it to provision with `vagrant up --provision`
- `vagrant halt`: Stops the VM.
- `vagrant reload`: Restarts the VM.
  - You can force it to provision with `vagrant reload --provision`
- `vagrant destroy`: Resets the VM to the base image.

## Known Issues/Limitations

- Windows users must start the Vagrant box in an escalated terminal, or Yarn/NPM will throw symlink errors.
