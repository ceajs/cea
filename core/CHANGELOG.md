# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0](https://github.com/ceajs/cea/compare/v2.1.0...v2.2.0) (2021-11-09)


### Bug Fixes

* codebase clean up ([f532e05](https://github.com/ceajs/cea/commit/f532e05f7c290d86d6029d2a2bdbfa4ef14d3575))
* **core:** legacy lines from merge, filename typo ([13e4512](https://github.com/ceajs/cea/commit/13e451271c0ced152efd5c87ed59a9030d67a2db))


### Features

* **core:** add notifier utils ([bb7a369](https://github.com/ceajs/cea/commit/bb7a369814507aa4434276095cd7bb4a03a1aeee))
* implement notifier ([2c9a5d7](https://github.com/ceajs/cea/commit/2c9a5d73e6620acfef91f19bd37dc709297a3ae3))





# [2.1.0](https://github.com/ceajs/cea/compare/v2.0.1...v2.1.0) (2021-10-27)

### Bug Fixes

- **check-in:** update form and corresponding encryption algos ([6e3fd54](https://github.com/ceajs/cea/commit/6e3fd54be22930cf3b4ae3d025cd56d94c3cc7a5))
- remove package-lock file ([ebb8385](https://github.com/ceajs/cea/commit/ebb8385bead190245fff6c551873685b49782e1d))

## [2.0.1](https://github.com/ceajs/cea/compare/v2.0.0...v2.0.1) (2021-10-16)

### Bug Fixes

- deps update patch ([f97d8cb](https://github.com/ceajs/cea/commit/f97d8cbc667ae73712e8c28ddd0414db52204c7d))

# [2.0.0](https://github.com/ceajs/cea/compare/v0.5.1...v2.0.0) (2021-10-16)

**Note:** Version bump only for package cea-core

## [0.5.1](https://github.com/ceajs/cea/compare/v0.5.0...v0.5.1) (2021-10-09)

**Note:** Version bump only for package cea-core

# [0.5.0](https://github.com/ceajs/cea/compare/v0.4.0...v0.5.0) (2021-09-07)

### Features

- better scraping practice ([09b73aa](https://github.com/ceajs/cea/commit/09b73aa3d5e529599e6356b7ffc820eedf1f1a46))

# [0.4.0](https://github.com/ceajs/cea/compare/v0.3.2...v0.4.0) (2021-07-25)

### Bug Fixes

- **build:** make sure src is kept as subfolder after esbuild ([e03b631](https://github.com/ceajs/cea/commit/e03b631b748cb2d78b783acd993952926c632843))
- **debug:** use esbuild only for debug ([e6d6a6d](https://github.com/ceajs/cea/commit/e6d6a6d8880eda647f831d9cae4257afbbb612a7))
- **login:** change preAuthURL to campusphere endpoint ([43bb894](https://github.com/ceajs/cea/commit/43bb8946179208efe738ace20636b09aa2fa8040))

### Features

- add test-score-notice plugin ([a3d149b](https://github.com/ceajs/cea/commit/a3d149be0b115c1b8b8918a345a8826d8e81159b))
- **campatibility:** add fzu edge-case formIdx ([984b40c](https://github.com/ceajs/cea/commit/984b40c9ad2ec584ff524c74950728fb462e76ce))

## [0.3.2](https://github.com/ceajs/cea/compare/v0.3.1...v0.3.2) (2021-07-04)

### Bug Fixes

- **check-in:** emply array is not falsy ([c63919d](https://github.com/ceajs/cea/commit/c63919dfe59566e964b7e70aa1d20fa8a53415f3))

## [0.3.1](https://github.com/ceajs/cea/compare/v0.3.0...v0.3.1) (2021-06-05)

**Note:** Version bump only for package cea-core

# 0.3.0 (2021-06-05)

### Bug Fixes

- **check-in:** invalid cookie error message ([59b9aed](https://github.com/ceajs/cea/commit/59b9aedb9ed7bbbf93fcd70f16242300e7f5c7da))
- **cli:** error message ([17426a8](https://github.com/ceajs/cea/commit/17426a8be8407baa699d71322c80de1b7746b599))
- **core:** avoid redirect hell ([da3df9d](https://github.com/ceajs/cea/commit/da3df9d2dbca6cc899b960c763ccdd3cb4e4e745))
- **core:** campus typo ([0282465](https://github.com/ceajs/cea/commit/0282465dc2fccc019e1e768b41b7f4b36c71a138))
- **core:** follow redirect derictly, clean up headers ([8952b25](https://github.com/ceajs/cea/commit/8952b2505a0faa9407d660b5d14063c8061d0a37))
- **core:** handle domain felid in set-cookie ([9dbee5c](https://github.com/ceajs/cea/commit/9dbee5c34beb17662c14c12f2cbced26baef6c84))
- **core:** modify cookie validation logic ([778a80c](https://github.com/ceajs/cea/commit/778a80cef828783930e841a2fe110ae9f5c95b55))
- **types:** cookie templete string typo ([1a54c5c](https://github.com/ceajs/cea/commit/1a54c5c8fee52be557a591cf133a8fc6184000a9))

### Features

- **check-in:** fix type CookieRawObject ([58495fa](https://github.com/ceajs/cea/commit/58495fa0175c7bb6b166cc731ca81dd1d1af4040))
- **cli:** add cea as a cli pkg ([3d56f33](https://github.com/ceajs/cea/commit/3d56f3303021477b5457dd8334425adeb25b79fb))
- **core:** build and pub cea-core ([1642e4a](https://github.com/ceajs/cea/commit/1642e4a3dfc2a1fc265ccd67f0bc3f484d5b3213))
- **core:** docs update ([bcf8fa4](https://github.com/ceajs/cea/commit/bcf8fa427c2f202bb277cbae06f8dfba54567e61))
- **core:** make auth redirect service configurable ([5048969](https://github.com/ceajs/cea/commit/5048969158f3650c3c8ae0a6a10a324e66bbb9a6))
- **core:** update deps - sstore ([44d7464](https://github.com/ceajs/cea/commit/44d74647bec4d7d78898483ce52cb65d7f823d74))
- create pkg cea-checkin-in ([8c12441](https://github.com/ceajs/cea/commit/8c12441a87dccfaa29073053c0a3449cc30cdf1f))

### BREAKING CHANGES

- **core:** cookie index changed to site host

## [0.2.2](https://github.com/ceajs/cea/compare/cea-core@0.2.1...cea-core@0.2.2) (2021-06-05)

**Note:** Version bump only for package cea-core
