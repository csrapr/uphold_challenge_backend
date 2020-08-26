# uphold_challenge_backend
Uphold junior backend dev challenge

## Setup guide
# 1 - Database
 - I'm using Postgres 12.4 on Windows 10 Pro X64
 - Create a database called `uphold_challenge_cesar`
 
 Windows instructions:
 Make sure you add bin on the install folder to your machine's environment variables
 
 - on a terminal window `psql -U postgres` where "postgres" is your username. postgres is the default username, and the one I am using
 - insert your password
 - type `CREATE DATABASE uphold_challenge_cesar;`
 - type `\l` to see if the above command ran successfully
 
 - In `Database.js` in the credentials object change the values to your own. As an example mine are
 `const credentials = {
  user: "postgres",
  host: "localhost",
  database: "uphold_challenge_cesar",
  password: "root",
  port: 5432,
};`

# 2 - Install necessary modules
- In the project root, run the command `npm i`

# 3 - Run the script
- Run the command `index.js` in the project root

# 4 - Test the script using jest
- Run the command `npm test` in the project root
