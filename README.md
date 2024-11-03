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

```bash
cd server
npm i
npx tsc
node index.js
```

## Website setup

For development

```bash
cd website
gatsby develop
```

For production

```bash
cd website
npm build
```

## Checklist

* Mobile first!
* Landing page
* Login
* Sign up (with email confirmation)
* Cookies/local storage
* Recipes, Cookbooks, sharing, groups...
