# Dream 11 Clone Server
## Prerequsites
- Install MongoDB - Follow tutorial [here](https://docs.mongodb.com/manual/administration/install-community/) 
- Install Dependancies using `npm install`
- Setup matches collection using `mongoimport -d=flipr -c=matches matches.json`
- Setup credits coollection using `mongoimport -d=flipr -c=credits --jsonArray playerCredits.json`
- Run `{{baseurl}}/generateTeams` to generate Teams file
- Setup teams collection using `mongoimport -d=flipr -c=teams --jsonArray teams.json`


## Running the server
- `node server.js`