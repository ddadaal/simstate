# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.0"></a>
## [2.0.0](https://github.com/viccrubs/simstate/compare/v1.3.1...v2.0.0) (2019-02-24)

### Features

* Partial Observer feature. Check out `README.md` for usage.
* Simpler and more consistent APIs for render-props and HOC

### Breaking Changes

* API changes for render-props
    - Only inject `useStore` into the children
    - No need to pass in store types; Use the `useStore` directly in children
* `useStores` are deprecated and will be removed in a future release


<a name="1.3.1"></a>
## [1.3.1](https://github.com/viccrubs/simstate/compare/v1.3.0...v1.3.1) (2019-02-13)


### Bug Fixes

* export useStores ([9fd4c4f](https://github.com/viccrubs/simstate/commit/9fd4c4f))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/viccrubs/simstate/compare/v1.2.0...v1.3.0) (2019-02-13)


### Features

* Adds strongly-typed `useStores` hook and `useStores` function in render-props and HOC to simplify multiple store injection

### Others

* (Source code) Flat directory structure and reorganize exports

<a name="1.2.0"></a>
# [1.2.0](https://github.com/viccrubs/simstate/compare/v1.1.1...v1.2.0) (2019-02-12)


### Features

* nested provider and provider will no longer block direct children's render ([2355733](https://github.com/viccrubs/simstate/commit/2355733))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/viccrubs/simstate/compare/v1.1.0...v1.1.1) (2019-02-12)


### Bug Fixes

* readme update ([e5c3827](https://github.com/viccrubs/simstate/commit/e5c3827))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/viccrubs/simstate/compare/v1.0.2...v1.1.0) (2019-02-11)


### Features

* introduce tslib and move tests for smaller bundle ([5a5e0e7](https://github.com/viccrubs/simstate/commit/5a5e0e7))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/viccrubs/simstate/compare/v1.0.1...v1.0.2) (2019-02-10)

- Fix dependency problem in package.json


<a name="1.0.1"></a>
## [1.0.1](https://github.com/viccrubs/simstate/compare/v1.0.0...v1.0.1) (2019-02-10)

- Fix dependency problem in package.json


<a name="1.0.0"></a>
# [1.0.0](https://github.com/viccrubs/simstate/compare/v0.0.4...v1.0.0) (2019-02-10)

- Ready for production


<a name="0.0.4"></a>
## [0.0.4](https://github.com/viccrubs/simstate/compare/v0.0.3...v0.0.4) (2019-02-10)

- Try to release a usable distribution

<a name="0.0.3"></a>
## 0.0.3 (2019-02-10)

- Still trying to figure out how to do with these tools :smile: