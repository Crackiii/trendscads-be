#!/bin/bash

echo "[INIT.SH]: Starting init.sh scripts..."
# Installing chromium
sudo amazon-linux-extras install epel -y
sudo yum install -y chromium


# Installing docker
sudo amazon-linux-extras install docker
## Start docker
sudo service docker start
##Add user to group
sudo usermod -a -G docker ec2-user
##Make docker auto-start
sudo chkconfig docker on
###Install docker compose
pip3 install docker-compose

