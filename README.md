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

* Deal with extra network requests during cookbook/recipe loading
* Add toggle for cookbook recipe order vs. editing
* Allow organizing cookbook recipes with drag/drop
* Add button to add sections between cookbook recipes
* Make adding multiple recipes in a row easy
* Allow printing a cookbook
* Make recipes avoid splitting between pages
* Add ingredient parsing
* Configuration
  * Port
  * Database name
  * Database timeout see https://nodejs.org/api/sqlite.html#new-databasesyncpath-options
  * Separate development and production
  * CORS
  * Server API url
* Add picture support within cookbooks
* Return to the debouncer to ensure all requests are properly debounced
  * It should put itself back into a locked state after running the queued job.

* Make recipes default to being a view mode with an edit button
* Allow editing recipe styles
* Add limit and offset to database facade calls
* Use react context to cache data, reduce server calls, and share state
* Investigate other recipe states
* Inform user when recipe fails to save
* Make it clear to the user which data has and hasn't been saved
* Correctly ensure that the client uses real UUIDs
* Make the edit recipe page smoothly enter in instead of flashing
* Add checks to API to prevent DOS attacks
* Show list of recipe names in Cookbook view
* Make recipe names expandable
* Give option when editing recipes of what Cookbooks it should apply to
* Show which cookbooks a recipe is attached to in recipe view
* Add WYSIWYG view
* Allow adding recipes to multiple cookbooks
* Changing focus into a text field should place the cursor in the appropriate location
* Ensure that randomUUID() works on non-localhost
* OTEL server-side
* Make database calls asynchronous https://www.npmjs.com/package/sqlite3
* Investigate replacing styled components global styles
* Optimize font loading
* Ensure Nextjs isn't adding anything odd in data
* Investigate further recipe fields
* Pages move on load
* Change ingredients/instructions instead of replacing the UUIDs
* Keep a history/make all changes auditable
* Display recipe history
* All multiple tabs to safely edit the same recipe
* Setup a webhook system for database changes
* Support mobile
* Finish login
* Add MFA and teach the user about good security
* Add email confirmation for login
* Use cookies to keep the user logged in
* Use local storage to allow caching between tabs?
* Allow users to create API keys
* Attach permissions to groups to allow collaboration and sharing
* Allow sharing recipes
* Add back a fade to buttons on login/register page
* Prevent going back a page or clicking on links while waiting for page to save
* Remove extra api calls made when a recipe first loads
