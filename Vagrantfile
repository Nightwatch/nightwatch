# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/bionic64'
  config.vm.network 'private_network', ip: '192.168.33.10'
  config.vm.synced_folder '.', '/vagrant'
  config.vm.provider 'virtualbox' do |vb|
    vb.memory = '1024'
  end
  config.berkshelf.enabled = true
  config.berkshelf.berksfile_path = 'chef/cookbooks/main/Berksfile'
  config.vm.provision 'chef_solo' do |chef|
    chef.cookbooks_path = 'chef/cookbooks'
    chef.add_recipe 'main'
  end
  config.vm.provision :shell, inline: <<-EOL
    sudo echo 'host   all             all           0.0.0.0/0          trust' > '/etc/postgresql/9.6/main/pg_hba.conf'
    sudo service postgresql restart
  EOL
  config.vm.provision :shell, run: 'always', privileged: false, inline: <<-EOL
    pm2 start /vagrant/chef/ecosystem.json
  EOL
end
