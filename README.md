# covid-visualisation

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Deploy to a static Jekyll site

The production build is configured for the `/covid-visualisation/` URL path.
After running `npm run build`, copy the **contents** of `dist/` into the
Jekyll site's `covid-visualisation/` directory, preserving the `index.html`,
`download.json`, `js/`, and `css/` paths. For example:

```
cp -R dist/. /path/to/jekyll-site/covid-visualisation/
```

The built page and its data request use `/covid-visualisation/` as their base,
so the app can be opened at
`https://<site-host>/covid-visualisation/`. When updating the app or its data,
replace the directory contents with a fresh production build.

### Lints and fixes files
```
npm run lint
```