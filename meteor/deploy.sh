#!/bin/bash

#bundle and deploy
forever stop /var/www/deployed/bundle/main.js
rm -rf /var/www/deployed/bundle
meteor bundle /var/www/deployed/groupnotes.tgz
tar -C /var/www/deployed -xf /var/www/deployed/groupnotes.tgz 

#start the server
export ROOT_URL='http://groupnotes.org'
export PORT='3000'
export MONGO_URL='mongodb://gn:groupnotes@localhost/groupnotes'
forever start /var/www/deployed/bundle/main.js
