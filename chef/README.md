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
  - [ ] Start API using `pm2` in own process.
  - [ ] Start bot using `pm2` in another process after API starts.
- [ ] Change working directory to `/vagrant` (where the project lives in the VM) when the user connects to the VM via SSH.

## Issues and Limitations

- Windows users must start the Vagrant box in an escalated terminal, or Yarn/NPM will throw symlink errors.
