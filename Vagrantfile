# -*- mode: ruby -*-
# vi: set ft=ruby :
# https://github.com/mercycorps/TolaActivity

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.network :private_network, ip: "192.168.111.222"
  config.vm.synced_folder ".", "/srv/www/tolaactivity", mount_options: ["dmode=777,fmode=777"]

  config.vm.hostname = 'default'

  config.vm.provision "shell" do |s|
    s.inline = "sudo apt-get update"
  end

  config.vm.provider "virtualbox" do |v|
    v.memory = 4096
  end

  config.vm.provision "shell", inline: "sudo apt-get update && sudo apt-get -y install python"

	config.vm.provision "ansible" do |ansible|
    ansible.inventory_path = "deployment/dev"
    ansible.playbook = "deployment/site.yml"
  end
end
