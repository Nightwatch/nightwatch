

# Install Node.js
node.default['nodejs']['install_method'] = 'binary'
node.default['nodejs']['version'] = '8.12.0'
node.default['nodejs']['binary']['checksum'] = '3df19b748ee2b6dfe3a03448ebc6186a3a86aeab557018d77a0f7f3314594ef6'
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
