## Cookbook

This project aims to create a website for hosting cookbooks.

Potential features:
* View recipes
* Arrange recipes in cookbooks
* Share recipes/cookbooks with others/groups
* Print recipes in a page-safe format
* Get extra cooking information
  + Change serving sizes
  + Learn about cooking steps
  + See alternative ingredients

## Server setup

This project is not yet stable and doesn't have a production build process.

To make development setup simple, 
this project uses npm workspaces
and development scripts.

### Database

The database used is sqlite
and is maintained using Flyway.
You will need to install both:

```bash
brew install sqlite
brew install flyway
```

If this is your first time, you will need to run the database migrations:

```bash
npm run migrate
```

This just runs `flyway migrate` for you.
If you need to use other flyway commands, you will need to do so from the `./server` directory:

```bash
cd server
flyway migrate
```

### Node

You will need to install node `v22.18.0` as specified in `.node-version` .
Check your node version using `node -v` .

To install a second version of node, 
use a tool like [fnm](https://github.com/Schniz/fnm#)
or [nvm](https://github.com/nvm-sh/nvm).

If you have `fnm` [configured correctly](https://github.com/Schniz/fnm/blob/master/docs/configuration.md)
the correct node version will automatically be setup
when your terminal is within the `cookbook` directory.

### NPM scripts

Currently this project is setup to use NPM.
I may consider switching to a faster alternative in the future.

To install all packages:

```bash
npm i
```

To run the entire project in developments:

```bash
npm run develop
```

To run individual projects, go to the specific directory and run the same command:

```bash
cd server # or server-api or website
npm run develop
```

In development mode, 
as you save changes to files, that portion of the project should reload immediately.

## Checklist

* Printer first!
* Add recipes
* Edit recipes
* See all recipes
* Print recipes

* Mobile first!
* Landing page
* Login
* Sign up (with email confirmation)
* Cookies/local storage
* Recipes, Cookbooks, sharing, groups...

* OTEL server-side
* Port should be configurable
* Database location should be configurable
* Add a database timeout see https://nodejs.org/api/sqlite.html#new-databasesyncpath-options
* Make database calls asynchronous https://www.npmjs.com/package/sqlite3
* Type check returned SQL values
* Make some way to separate development from production for databases
* Use react context to reduce server calls and share state
* Investigate npm monorepo
* Pages move on load
* Investigate replacing styled components global styles
* Optimize font loading
* Ensure Nextjs isn't adding anything odd in data
* Setup cors site to be loaded with a config
* Setup config with development vs production config
* Setup website with config for server api
