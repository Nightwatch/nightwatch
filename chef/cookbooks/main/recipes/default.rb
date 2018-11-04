

# Install Node.js
node.default['nodejs']['install_method'] = 'binary'
node.default['nodejs']['version'] = '10.13.0'
node.default['nodejs']['binary']['checksum'] = 'b4b5d8f73148dcf277df413bb16827be476f4fa117cbbec2aaabc8cc0a8588e1'
include_recipe 'nodejs'

# Install Yarn
include_recipe 'yarn'

# Install Postgres
postgresql_server_install 'Postgres install' do
  version '9.6'
  password nil
end

# Doesn't work as intended. TODO: See if this can be removed. Hacky fix is in inline shell provision script in Vagrantfile.
postgresql_access 'local_postgres_superuser' do
  comment 'Local postgres superuser access'
  access_type 'local'
  access_db 'all'
  access_user 'postgres'
  access_addr nil
  access_method 'trust'
end

# Creates database for unit tests
postgresql_database 'nightwatch_test' do
  locale 'C.UTF-8'
end

# Creates database for development use
postgresql_database 'nightwatch' do
  locale 'C.UTF-8'
end


# Install Redis
include_recipe 'redisio'
include_recipe 'redisio::enable'

# Updates any packages
apt_update 'Update' do
  ignore_failure true
  action :update
end

# Install PM2 globally
npm_package 'pm2'

link '/usr/local/bin/pm2' do
  to "/usr/local/nodejs-#{node['nodejs']['install_method']}-#{node['nodejs']['version']}/bin/pm2"
end

# Install Python
apt_package 'software-properties-common'
apt_repository 'deadsnakes' do
  uri 'ppa:deadsnakes/ppa'
  action :add
end

# Updates any packages
apt_update 'Update' do
  ignore_failure true
  action :update
end

# Install Python
apt_package 'python3.6'
