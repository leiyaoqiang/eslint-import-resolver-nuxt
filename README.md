# eslint-import-resolver-nuxt

# Installation

Install ESLint either locally or globally.

```sh
$ npm install eslint --save-dev
```

If you installed ESLint globally, you have to install eslint-import-resolver-nuxt globally too. Otherwise, install it locally.

```sh
$ npm install eslint-import-resolver-nuxt --save-dev
```

# Configuration
Default Node-style module resolution plugin for eslint-plugin-import.

Published separately to allow pegging to a specific version in case of breaking changes.

Config is passed directly through to resolve as options:

```
settings:
  import/resolver:
    nuxt:
      # The path of nuxt resource directory to relative process.cwd() 
      # if unset, default is ''
      nuxtSrcDir: nuxt 
      extensions:
        # if unset, default is just '.js', but it must be re-added explicitly if set
        - .js
        - .jsx
        - .es6
        - .coffee

      paths:
        # an array of absolute paths which will also be searched
        # think NODE_PATH
        - /usr/local/share/global_modules

      # this is technically for identifying `node_modules` alternate names
      moduleDirectory:

        - node_modules # defaults to 'node_modules', but...
        - bower_components

        - project/src  # can add a path segment here that will act like
                       # a source root, for in-project aliasing (i.e.
                       # `import MyStore from 'stores/my-store'`)
```                       
or to use the default options:

```
settings:
  import/resolver: nuxt 
```
