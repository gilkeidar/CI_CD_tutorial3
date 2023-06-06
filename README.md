# CI_CD_tutorial3
https://github.com/gilkeidar/CI_CD_tutorial3/blob/main/.github/workflows/cicd_push_to_main.yml/badge.svg

Testing CI/CD implementation (new variations)

Requirements for this to work:

* Repository needs to be public (for GitHub bot to do automatic commits for docs + minimization)
* run `npm install --save-dev jest` to download Jest and generate the `package-lock.json` and `package.json` files. These are necessary for the CI/CD to work properly. Also make sure to put `node_modules` in the `.gitignore` unless you want almost 4000 files pushed to the repository

Need the following directory structure

* `.github`
  * `workflows`
    * Store `.yml` files for CI/CD workflows
* `src`
  * All development code goes here (JS, HTML, CSS, etc.)
* `tests`
  * All Jest test files go here (need at least one test, otherwise Jest errors out)
* `.gitignore`
  * Make sure to include `node_modules` here
* `README.md`
* `config.json`
  * For JSDocs configuration (needs to be here - CI/CD script refers to it, but can be easily removed)
* `package-lock.json`
  * Generated when installing Jest as described above
* `package.json`
  * Generated when installing Jest as described above
  * Make sure to include
    ```javascript
        "scripts": {
        "test": "jest"
        }
    ```
    in the `package.json` file for `npm test` to run correctly in the CI/CD script

    test change 3