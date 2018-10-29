

# Install Node.js
node.default['nodejs']['install_method'] = 'binary'
node.default['nodejs']['version'] = '10.12.0'
node.default['nodejs']['binary']['checksum'] = '8d13d57aaf95177e97d29c0944d79a17de8c3a31ba3fe88d1846cfd907e52111'
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

# Updates any packages
apt_update 'Update' do
  ignore_failure true
  action :update
end

npm_package 'pm2'

link '/usr/local/bin/pm2' do
  to "/usr/local/nodejs-#{node['nodejs']['install_method']}-#{node['nodejs']['version']}/bin/pm2"
end
