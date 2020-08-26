# Epidemic Investigations Server 🔎 🤖!
handles the logic, API and db setups.

# Table of contents
<!--ts-->
   * [Setting up locally](#setting-up-locally)
   * [Create files and folders](#create-files-and-folders)
   * [Deploying](#deploying)
<!--te-->

# Setting up locally
## Basics
1. install git, node 
2. clone the repo

## Server
1. check the **.env-sample** file for relevant configuration the server needs and add those fields to a new **.env** file
2. `npm install` 
3. `npm start`


# Create files and folders
>   Important Tip: organize your files around features, not rules.

**add files according to the following structure -** 
- **package.json**
- **node modules/** - under git ignore
- **utils/** 	- for utils files
- **config/**  - config files , doesn't seem like we will have any
- **app/** - contains all the logic files
	- **server.ts** -  main file
	- **DBService/**
		- postgres config files
	- **APIService/**
		- **ServiceName**
			- **models/**
			- other related files
		- **ServiceName**
			- **models/**
			- other related files

# Deploying
 - TBD

