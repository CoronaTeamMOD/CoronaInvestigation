# Corona Investigations 🕵️  🔎 !
This project enables investigators to accurately and conveniently process their investigation, while viewing and updating data that flows through available and updating APIs and data sources.

## Table of contents
<!--ts-->
   * [Setting up locally](#setting-up-locally)
   * [Create files and folders](#create-files-and-folders)
   * [Contributing](#contributing)
   * [Deploying](#deploying)
<!--te-->

## Setting up locally
### Basics
1. install git, node 
2. clone the repo

### Server
1. `cd server/`
2. check the **.env-sample** file for relevant configuration the server needs and add those fields to a new **.env** file
3. `npm install` 
4. `npm start`

### Client with server
1. `npm install`
2. check the **.env-sample** file **both in ther server/ folder and the client/ folder** for relevant configuration the server and client need and add those fields to a new **.env** file in the corresponding folder
3. cd back into the project
4. `npm run dev` 

## Create files and folders
check appropriate READMEs in client and server, accordingly!

## Contributing
1. checkout to a branch from the **dev** branch - 
```
git checkout dev
git pull 
git checkout -b your-branch name
```
2. make some changes!
3. commit, push to your branch, do whatever!
4. rebase if needed
5. open PR to dev and wait for comments and approval!
6. fix according to PR discussions, push again if needed
7. once it's in dev - grab a drink,  we'll handle the rest

### Pr Labeling
Labels will be automatically added according to the .github/labels.yml file formats!

## Deploying
TBD
