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

### Development

```bash
cd server
npm i
npx tsc
node --watch public/index.js
```

### Production

```bash
cd server
npm i
npx tsc
node public/index.js
```

## Website setup

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
cd server/migrations
flyway migrate
```

### Development

```bash
cd website
gatsby develop
```

### Production

```bash
cd website
npm build
```

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
