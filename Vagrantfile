# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure('2') do |config|
  config.vm.box = 'ubuntu/bionic64'
  config.vm.network :private_network, ip: '192.168.33.10'
  config.vm.synced_folder '.', '/opt/nightwatch', type: 'nfs'
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
  config.vm.provision :shell, run: 'always', inline: <<-EOL
    if ! grep -qF "192.168.33.10 localhost" /etc/hosts;then
      echo "192.168.33.10 localhost" >> /etc/hosts
    fi
  EOL
  config.vm.provision :shell, privileged: false, inline: <<-EOL
    echo "alias python=python3" >> ~/.bashrc
    source ~/.bashrc
  EOL
  config.vm.provision :shell, run: 'always', privileged: false, inline: <<-EOL
    cd /opt/nightwatch
    yarn
    pm2 start /opt/nightwatch/chef/ecosystem.json
  EOL
end
