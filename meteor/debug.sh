#!/bin/bash
#start the server
export ROOT_URL='http://groupnotes.org'
export PORT='3000'
export MONGO_URL='mongodb://gn:groupnotes@localhost/groupnotes'
meteor
