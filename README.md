# Server Map

A CLI autocompletion tool to remember your servers and use it to ssh into a server.

## How to use
1. Create an `inventories` directory in your home folder
2. Create a file for your datacenter/group with the name of your dc/group 
3. Use `ini` file format for adding your servers in the file
	1. Example format
```
[dbservers]
one.example.com
two.example.com

[appservers]
one.appserver.com
two.appserver.com
```

Works with bash and zsh

![servermap](./servermap.gif)
