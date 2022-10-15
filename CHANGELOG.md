# [1.31.0](https://github.com/mkayander/leetpal/compare/v1.30.0...v1.31.0) (2022-10-15)


### Features

* Added initial mysql migration for the local dev database ([23e4871](https://github.com/mkayander/leetpal/commit/23e48713bb10b62b07c085678bcbdb5328339da1))

# [1.30.0](https://github.com/mkayander/leetpal/compare/v1.29.0...v1.30.0) (2022-10-13)


### Bug Fixes

* Fixed acRate by parsing it to a float ([1d11aa0](https://github.com/mkayander/leetpal/commit/1d11aa06e1d46e2c85b81af235f3b1f74a0a002c))
* Fixed pointer events at svg circle ([8d50cdb](https://github.com/mkayander/leetpal/commit/8d50cdbee432a61b957cbf8d21c77d37c1cb33b9))
* Fixed question summary centering ([c9e0f3f](https://github.com/mkayander/leetpal/commit/c9e0f3fbb7caa1afb35ff5382265e1a73c53e71f))


### Features

* Added prisma db push script ([7d514f9](https://github.com/mkayander/leetpal/commit/7d514f9256095c3cfaa58d397866994e5287ae00))
* Moved to MySql database provider ([17f77df](https://github.com/mkayander/leetpal/commit/17f77df1df1958f956ba14c4b6cc12416c54c4a2))

# [1.29.0](https://github.com/mkayander/leetpal/compare/v1.28.1...v1.29.0) (2022-10-11)


### Bug Fixes

* Use new scalar types correctly. Remove redundant JSON parsing. ([51729d3](https://github.com/mkayander/leetpal/commit/51729d34dd551bf71854227326d3976a3918b883))


### Features

* Added globalData operation ([57a18e8](https://github.com/mkayander/leetpal/commit/57a18e8a097e953227b84daafffa679324be1320))
* Added GraphQL scalars and session cookie parsing ([d480732](https://github.com/mkayander/leetpal/commit/d480732d20c2acba4eff539e2b7863cd0a524240))
* Added test global query to check session authentication ([e126188](https://github.com/mkayander/leetpal/commit/e126188d11c96338ee74d1b2fd352b823d8c1398))
* Installed cookie and codegen "add" packages ([d00689b](https://github.com/mkayander/leetpal/commit/d00689b3e3b6d9e625df1194ed1cc52f43c717bb))
* Proxy session cookie to the target server ([f57156a](https://github.com/mkayander/leetpal/commit/f57156a6958966d6f793b6cb132c6dfed464ed6e))

## [1.28.1](https://github.com/mkayander/leetpal/compare/v1.28.0...v1.28.1) (2022-10-05)


### Bug Fixes

* Fixed Type Error when building the project ([6588db4](https://github.com/mkayander/leetpal/commit/6588db4b0931643c09d2c696e39ba842eaacf141))

# [1.28.0](https://github.com/mkayander/leetpal/compare/v1.27.0...v1.28.0) (2022-10-05)


### Features

* Added "postinstall" script ([0e7ef76](https://github.com/mkayander/leetpal/commit/0e7ef76b8a937acbbc74f197d122be14ff3044fe))

# [1.27.0](https://github.com/mkayander/leetpal/compare/v1.26.1...v1.27.0) (2022-10-04)


### Bug Fixes

* Improve question content styles ([d4f4efe](https://github.com/mkayander/leetpal/commit/d4f4efeb40e8b42d28bd36fa429a3c1694ca657a))


### Features

* Use grid layout for the data sections at the dashboard ([ee1f885](https://github.com/mkayander/leetpal/commit/ee1f885482c9ca1014be88aa802d943e386081ef))

## [1.26.1](https://github.com/mkayander/leetpal/compare/v1.26.0...v1.26.1) (2022-10-03)


### Bug Fixes

* Allow images when sanitizing HTML ([5aec653](https://github.com/mkayander/leetpal/commit/5aec6534f3979bb8d4e2d144198cca96ac9aa0f8))

# [1.26.0](https://github.com/mkayander/leetpal/compare/v1.25.1...v1.26.0) (2022-10-02)


### Features

* Added gradient colors to the percentage circle ([d763943](https://github.com/mkayander/leetpal/commit/d76394316a32a8923751a238b1e7958fdf2ff919))
* Added Rating Buttons component ([05d2ad6](https://github.com/mkayander/leetpal/commit/05d2ad6d9da345e5930c858fc53a7c64894ef9ee))
* Updated Question summary ([a273afa](https://github.com/mkayander/leetpal/commit/a273afa389af8b826e9cd7e6f922fe2e426078a9))

## [1.25.1](https://github.com/mkayander/leetpal/compare/v1.25.0...v1.25.1) (2022-09-30)


### Bug Fixes

* Show loader when question data is absent ([fde09ee](https://github.com/mkayander/leetpal/commit/fde09ee7480fc8d99ac317b00766ba5291e09329))

# [1.25.0](https://github.com/mkayander/leetpal/compare/v1.24.0...v1.25.0) (2022-09-30)


### Bug Fixes

* Prevent error when stats variable is undefined ([d294722](https://github.com/mkayander/leetpal/commit/d2947228d90913195a9c30352e6232bcae6c52c5))


### Features

* Return random color variables if slug is unknown ([507819a](https://github.com/mkayander/leetpal/commit/507819afe44c728733462bc902b1ac1d4f0bc7d1))
* Updated Circular Percentage component ([e9b750e](https://github.com/mkayander/leetpal/commit/e9b750e7b5e08fba8cada0a86c31757e88244398))
* Use custom percentage content ([569449b](https://github.com/mkayander/leetpal/commit/569449b0f80683cd40691adc733029e71ed2d451))

# [1.24.0](https://github.com/mkayander/leetpal/compare/v1.23.0...v1.24.0) (2022-09-28)


### Bug Fixes

* Calculated values that depend on size ([a2f97e7](https://github.com/mkayander/leetpal/commit/a2f97e764877a9470d1e8882dd6da122b476a59c))


### Features

* Parse JSON data from graphql query ([23725cf](https://github.com/mkayander/leetpal/commit/23725cffb1da11ce274fd67643131bd73b7c38a4))
* Use new circular percentage component ([78fa483](https://github.com/mkayander/leetpal/commit/78fa483141165b00bfcad486aae1d4fb37b83943))

# [1.23.0](https://github.com/mkayander/leetpal/compare/v1.22.0...v1.23.0) (2022-09-27)


### Features

* Implemented a circular progress component ([d36e13e](https://github.com/mkayander/leetpal/commit/d36e13eeca9925ed57c155caac26b7ff839547d9))
* Moved daily question fetch to a separate api file ([ad0cbcb](https://github.com/mkayander/leetpal/commit/ad0cbcbe54ebef330d471d8bbd7693b1f0704d3b))
* Updated Question Summary component ([ad78d9b](https://github.com/mkayander/leetpal/commit/ad78d9b63d9b95e224f9207cfb435ffc40539bbe))
* Updated tag colors ([09adb82](https://github.com/mkayander/leetpal/commit/09adb82fa5426bd371b5deff2504ceab05c0fbb1))

# [1.22.0](https://github.com/mkayander/leetpal/compare/v1.21.0...v1.22.0) (2022-09-26)


### Bug Fixes

* Added custom app props type ([56f6cda](https://github.com/mkayander/leetpal/commit/56f6cda1dd566c550ea14cf07b5ed7aed8a6567a))
* Remove redundant global styles ([21cbce5](https://github.com/mkayander/leetpal/commit/21cbce5fcbc845636ce07022694f9b68019d8ec0))
* Specify on-primary text color ([23b91b1](https://github.com/mkayander/leetpal/commit/23b91b12f7f7bcf8f67f51a748fb76b5c9d7f579))


### Features

* Added custom theme items ([efaab09](https://github.com/mkayander/leetpal/commit/efaab09b4f4c3ac96f2d4a4ca72f5beca8823c99))
* Implemented a question summary card ([061ae31](https://github.com/mkayander/leetpal/commit/061ae3113edb325476b54c15dafc8aadb088d8b0))
* Show dashboard as index route ([f4bb818](https://github.com/mkayander/leetpal/commit/f4bb818c3a4715ea15f2ff0b710fd1dbad5847a1))
* Updated Data Section ([4839109](https://github.com/mkayander/leetpal/commit/48391091ab2e22366c137edc3e48c2568df6c110))
* Use special tag background colors ([ef00e70](https://github.com/mkayander/leetpal/commit/ef00e703cbadd0a1f81fee09ff9ec29c94c350df))

# [1.21.0](https://github.com/mkayander/leetpal/compare/v1.20.0...v1.21.0) (2022-09-24)


### Bug Fixes

* Handle proxied GraphQL errors correctly ([48c61c1](https://github.com/mkayander/leetpal/commit/48c61c15c902386f14936090b363d7a7aea347ca))


### Features

* Added activeDailyCodingChallengeQuestion GraphQL types ([de4a0be](https://github.com/mkayander/leetpal/commit/de4a0be38c350a08ca2bdbcf23d607ab84a3e3c5))
* Added Topic Tag component ([73a94ad](https://github.com/mkayander/leetpal/commit/73a94ad24d97aa6a6cd8dc242eb7908e02ac5666))
* Display basic info about the question of the day ([5e7d3b4](https://github.com/mkayander/leetpal/commit/5e7d3b4034507ac2718264d6b98f13d9aa94d6aa))
* Display Daily Problem section ([9bee39c](https://github.com/mkayander/leetpal/commit/9bee39c1e4cdfa0dc19f0aac5d80a032ee0ebbe2))
* Display user's name at the page title ([15633dd](https://github.com/mkayander/leetpal/commit/15633dd662b4319f210e9fcccef9e7b41c91fea6))
* Implemented a detailed GraphQL question data schema ([12aa89b](https://github.com/mkayander/leetpal/commit/12aa89b5a74174fbe3fe7870a9fb4c8bf43a1ab4))
* Installed sanitize-html package ([2f409a1](https://github.com/mkayander/leetpal/commit/2f409a1b9fb7cc47532bb5aab605d2f7a9e4b8b7))

# [1.20.0](https://github.com/mkayander/leetpal/compare/v1.19.1...v1.20.0) (2022-09-22)


### Bug Fixes

* Fixed GraphQL schema array types ([3e89d42](https://github.com/mkayander/leetpal/commit/3e89d4216f17d4d8349525d123ff864515ae1dea))
* Installed sass compiler ([7300914](https://github.com/mkayander/leetpal/commit/730091432c823eacc49f369fc6d3c25464a3bb41))
* Make stats array non-nullable ([3bae2e8](https://github.com/mkayander/leetpal/commit/3bae2e892f78feb423afb3d86122ae3403502be5))


### Features

* Added app bar elevation ([453e262](https://github.com/mkayander/leetpal/commit/453e26274ac25d452b010fb11f730348f56554ba))
* Added Data Section component ([b0c0e60](https://github.com/mkayander/leetpal/commit/b0c0e603469e122f6dd83e01ca2c92b4fa54ebf9))
* Added section components ([27f6de0](https://github.com/mkayander/leetpal/commit/27f6de0f181871480044fb04e65282b56ccbb87e))
* **devtools:** Added IDE meta file ([0bf142a](https://github.com/mkayander/leetpal/commit/0bf142ae26b63d12c6e8c58985920e4e6ff77a53))
* Display leetcode user stats data ([8eb5b7d](https://github.com/mkayander/leetpal/commit/8eb5b7d965d7e2a199b485fa77dfe6da4e53e5a5))
* Display section components ([70a777a](https://github.com/mkayander/leetpal/commit/70a777a19b30839c470dcb36092e675f51937420))
* Parse submissions data to object ([6081a21](https://github.com/mkayander/leetpal/commit/6081a212237291e332a1bd7a4dcb9eaf8837c87f))
* Updated Data Section styles ([b04f460](https://github.com/mkayander/leetpal/commit/b04f4602de7afd5fbcd4271d06d50077af484db4))

## [1.19.1](https://github.com/mkayander/leetpal/compare/v1.19.0...v1.19.1) (2022-09-15)


### Bug Fixes

* Invalidate queries before trying to refetch to get consistent data updates ([2b5000f](https://github.com/mkayander/leetpal/commit/2b5000f8dd057dc18061868cd4e4e76bdce19516))
* Use "SetNull" for the leetCodeUser onDelete action ([ba7288e](https://github.com/mkayander/leetpal/commit/ba7288e6ac06218526becb402e2069910347b690))
* Use only one id string as input ([a71c045](https://github.com/mkayander/leetpal/commit/a71c045f649798a9decc1f395c6e6ae0f69f274e))

# [1.19.0](https://github.com/mkayander/leetpal/compare/v1.18.0...v1.19.0) (2022-09-14)


### Bug Fixes

* Fixed syntax at main.yml ([6af6814](https://github.com/mkayander/leetpal/commit/6af6814be49314d1c74dd689ecd6eb06a8768a28))
* Use "pnpx" command for semantic-release ([74b0e7d](https://github.com/mkayander/leetpal/commit/74b0e7d796c8808c569791c7abfc8f1d8cb9e0fd))


### Features

* Switched to using PNPM instead of Yarn ([41534ca](https://github.com/mkayander/leetpal/commit/41534cac2358c45bc044ea898e416bb43497233c))
* Use package.json script for running semantic-release ([c581377](https://github.com/mkayander/leetpal/commit/c581377511a8f16634b5525467cb1e82364a4342))

# [1.18.0](https://github.com/mkayander/leetpal/compare/v1.17.0...v1.18.0) (2022-09-11)


### Bug Fixes

* Fixed AWS S3 upload being run twice ([8eb14cc](https://github.com/mkayander/leetpal/commit/8eb14cc6518d131959c80ee3ac326ca6295da980))


### Features

* Added formik component props type inference ([ec75d3b](https://github.com/mkayander/leetpal/commit/ec75d3b845808b42031ef1c22080a5faaee79857))
* Added Formik usage on dashboard page ([f8cf177](https://github.com/mkayander/leetpal/commit/f8cf177bf640419c4bc549c03d1b1fd59babafd0))
* Added unlink user operation ([b56e751](https://github.com/mkayander/leetpal/commit/b56e7518a6b4c534f55f7939e2fa5b2e549b4e64))
* Installed formik with MUI support ([2cfac17](https://github.com/mkayander/leetpal/commit/2cfac178aab4fb6ddb15531856c92fce30d69b99))

# [1.17.0](https://github.com/mkayander/leetpal/compare/v1.16.0...v1.17.0) (2022-09-08)


### Bug Fixes

* Fixed account link-up logic ([4a78cbb](https://github.com/mkayander/leetpal/commit/4a78cbb09dc9e94c1c7cd73fce72088ac121da76))
* Make input id optional ([7a38bda](https://github.com/mkayander/leetpal/commit/7a38bdaeef22028da4959452bacf4b4c19a72db1))


### Features

* Added loading state feature for the main layout ([8c58311](https://github.com/mkayander/leetpal/commit/8c5831130be5ffe0c9296a9fd07c8c6b53330301))
* Implemented basic dashboard page with the ability to link the leetcode account ([14047b3](https://github.com/mkayander/leetpal/commit/14047b30e8191344f5419aeb1ab27e43b551e03d))

# [1.16.0](https://github.com/mkayander/leetpal/compare/v1.15.0...v1.16.0) (2022-09-07)


### Bug Fixes

* Removed unused import. ([7c758a3](https://github.com/mkayander/leetpal/commit/7c758a35d3fa7e04ab52e29fe1cb20cc6f33f1fb))


### Features

* Added basic global context stub. ([f3c2134](https://github.com/mkayander/leetpal/commit/f3c213491be8533deadf75618ec1be611a04fabc))
* Added bucket base url env variable ([3a3135c](https://github.com/mkayander/leetpal/commit/3a3135cfe9b2c8463731bbb2ad485483cb37211c))
* Added getImageUrl util function to get an absolute image url from S3. ([13a32da](https://github.com/mkayander/leetpal/commit/13a32da85cc805bb8abd6f224dc5c01103ae0d6d))
* Added hook for uploading user's avatar image to a S3 bucket. ([968790c](https://github.com/mkayander/leetpal/commit/968790cadc83f235fd5859035742f5f9d9f6f11e))
* Added setBucketImage mutation operation to user sub router. ([9017219](https://github.com/mkayander/leetpal/commit/90172196752a3b66662cacafa93e9ac953d2af44))
* Implement public runtime config type safety. ([9d94f12](https://github.com/mkayander/leetpal/commit/9d94f122513698ccaaf8e214db55d7a96b65e002))
* Improved navBar. Added S3 images usage. ([0d16514](https://github.com/mkayander/leetpal/commit/0d16514e29c2a4aa931838dcb53f32c7058ac370))
* Provide all user properties to a session instance. ([c390899](https://github.com/mkayander/leetpal/commit/c39089955f66f8df296bbd5bd4604c2acfc7cff0))
* Provide bucket base url to public runtime config. ([779075a](https://github.com/mkayander/leetpal/commit/779075aed18097c5f511179caf4b229eba0df924))
* Removed Session widget. ([b63418d](https://github.com/mkayander/leetpal/commit/b63418d061f97c2c2e57a2f573c55575b25c3002))
* Use main layout. ([df3242a](https://github.com/mkayander/leetpal/commit/df3242a3cb2993979ea2721839129ca41f47e1ae))

# [1.15.0](https://github.com/mkayander/leetpal/compare/v1.14.0...v1.15.0) (2022-09-06)


### Features

* Added bucket image field for user ([2ea8977](https://github.com/mkayander/leetpal/commit/2ea897786aa7f94473d482c7c489dd6d7ccd4b6e))

# [1.14.0](https://github.com/mkayander/leetpal/compare/v1.13.0...v1.14.0) (2022-09-05)


### Features

* Introduced AWS S3 file upload test ([3cfbe73](https://github.com/mkayander/leetpal/commit/3cfbe7315a49d09ab510def6deaff0bdd71ed8b9))

# [1.13.0](https://github.com/mkayander/leetpal/compare/v1.12.0...v1.13.0) (2022-09-04)


### Features

* Added dashboard page stub ([449aa9d](https://github.com/mkayander/leetpal/commit/449aa9ddf2797bc84bb3327e36e99808bd7c4037))
* Added leetcode user model schema ([b5848a9](https://github.com/mkayander/leetpal/commit/b5848a96162bbf80a560b557435bc8c9ed215901))
* Added Main layout usage ([cd78ced](https://github.com/mkayander/leetpal/commit/cd78ced462bc9728043778ba3750f58fd3d2a8ec))
* Added TRPc handler for the leetcode model ([0a9f51b](https://github.com/mkayander/leetpal/commit/0a9f51b8c3f076703cb04aa8cb3fa228170687d9))
* Implemented a common main layout component ([502de06](https://github.com/mkayander/leetpal/commit/502de065f5edeea4e92fa8ae5dd53f8d2861b2b2))
* Implemented an AppBar and footer components ([fd79314](https://github.com/mkayander/leetpal/commit/fd79314dbe7dbc4e85f3530c375198b1de90d726))
* Installed Material icons package ([b490bd5](https://github.com/mkayander/leetpal/commit/b490bd5ce2d50d38951893db2e976fccabf3d44f))
* Installed Prettier Prisma plugin package ([276069b](https://github.com/mkayander/leetpal/commit/276069b58904d519cfa3d20314d4cebc13653571))

# [1.12.0](https://github.com/mkayander/leetpal/compare/v1.11.0...v1.12.0) (2022-08-31)


### Bug Fixes

* Removed unused import ([8c17de2](https://github.com/mkayander/leetpal/commit/8c17de22d790ae2a3f47f68e96c07ab9cc23afb1))


### Features

* Added Apollo client and provider ([9c8de8e](https://github.com/mkayander/leetpal/commit/9c8de8e3ea8c8571a09a2d3c1c568b8d75d872df))
* Added Apollo client usage ([7e28e7f](https://github.com/mkayander/leetpal/commit/7e28e7f6fdc16aa70bc2abb61e5db9a8f33dd91a))
* Added codegen config ([d5b28d9](https://github.com/mkayander/leetpal/commit/d5b28d9df8afcbf907b2596c23fe12fc987cac95))
* Installed Apollo client and GraphQL codegen packages ([28d1198](https://github.com/mkayander/leetpal/commit/28d11985994590ccbd906417055e16a0017f6df0))
* Updated GraphQL source schema. Added query operation ([c4a8f1b](https://github.com/mkayander/leetpal/commit/c4a8f1bc3f60c623b248fb20a8392a88b2c35a7d))

# [1.11.0](https://github.com/mkayander/leetpal/compare/v1.10.0...v1.11.0) (2022-08-30)


### Bug Fixes

* Display and log error request ([be89dac](https://github.com/mkayander/leetpal/commit/be89daca59e02956ecb1eea19aee177da393a850))
* Fixed Google user image display ([920e502](https://github.com/mkayander/leetpal/commit/920e5026b86ba88d80909883ce09927a29e653cd))
* Fixed wrong parent tag error ([a06771f](https://github.com/mkayander/leetpal/commit/a06771fb803c3e2663afa605be00e7d5c55a6634))


### Features

* Initial reverse-engineered GraphQL schema ([da30c6b](https://github.com/mkayander/leetpal/commit/da30c6b644c1841c1995d858ab626473993c37e4))

# [1.10.0](https://github.com/mkayander/leetpal/compare/v1.9.0...v1.10.0) (2022-08-29)


### Features

* Added getUserProfile graphql api query ([2b34b38](https://github.com/mkayander/leetpal/commit/2b34b385353fa27f60300785645ed71e0fbab2fd))
* Added graphql api proxy endpoint ([f372a42](https://github.com/mkayander/leetpal/commit/f372a42904db0cafbac7b6f85813ed3bcc49dc3b))
* Added react-query provider ([1abe2f3](https://github.com/mkayander/leetpal/commit/1abe2f3a4947410e9f8100709b8027521fd96891))
* Added test graphql request usage ([c9c03b1](https://github.com/mkayander/leetpal/commit/c9c03b1dc725e6d3f92b91fc74b74a7b55097294))
* Installed graphql-request, axios and react-query ([f6fc7a1](https://github.com/mkayander/leetpal/commit/f6fc7a166d4f5a02323aa1909bda75e29d647764))

# [1.9.0](https://github.com/mkayander/leetpal/compare/v1.8.0...v1.9.0) (2022-08-25)


### Features

* Added Google, Email, and a test Credentials provider ([9fe9884](https://github.com/mkayander/leetpal/commit/9fe988449f5b4dab090c482ee20d7b79bfd9a414))
* Installed nodemailer ([a73a626](https://github.com/mkayander/leetpal/commit/a73a6268eb9a407770f3b4b811539362b7aab663))
* Updated env variables template ([6b690fe](https://github.com/mkayander/leetpal/commit/6b690fed4b3791e5c02120b09154b8e0c5852489))

# [1.8.0](https://github.com/mkayander/leetpal/compare/v1.7.0...v1.8.0) (2022-08-22)


### Bug Fixes

* Code cleanup ([3a168f9](https://github.com/mkayander/leetpal/commit/3a168f9475cae3498d726fdb5a93f2807438a2b0))
* Renamed a Problem card component ([47fb6c7](https://github.com/mkayander/leetpal/commit/47fb6c7ff0a56e66ba83e3e45597931ae1ac752e))
* Specify meta head tags at _app instead of _document ([e3b4a48](https://github.com/mkayander/leetpal/commit/e3b4a48649df1ba92222d25f3998f3bbccb11167))


### Features

* Added nextAuth prisma adapter ([6a8c8e4](https://github.com/mkayander/leetpal/commit/6a8c8e42921922c60ef3ec7f00bbed5ba89ac958))
* Added test protected route for authed users ([8d62786](https://github.com/mkayander/leetpal/commit/8d62786c69f22f69ca5fd15221e7ebc297939b39))
* Implemented a sign-out button ([829672c](https://github.com/mkayander/leetpal/commit/829672c7e4f29b22be06b6a3ca87a1b594c857d2))
* Specify user id in the session ([8f79984](https://github.com/mkayander/leetpal/commit/8f799845923f0e4ebc2a0e19ba7c1c6d4d924a74))

# [1.7.0](https://github.com/mkayander/leetpal/compare/v1.6.0...v1.7.0) (2022-08-22)


### Features

* Added .env example file with a list of required variables ([fb555e6](https://github.com/mkayander/leetpal/commit/fb555e6c39b49750826ddad1c0f89feeddbb01bb))

# [1.6.0](https://github.com/mkayander/leetpal/compare/v1.5.1...v1.6.0) (2022-08-22)


### Features

* Added account model to prisma ([5b0d2d3](https://github.com/mkayander/leetpal/commit/5b0d2d3478f27fd1495b7a7ff416b71d0e957a5e))
* Added migration status command ([8b1b472](https://github.com/mkayander/leetpal/commit/8b1b472372f41c843f8b40693f92b7c051f292f4))
* Updated prisma client version ([490dc51](https://github.com/mkayander/leetpal/commit/490dc5109204feae2a41d2ed16808a52344b800d))

## [1.5.1](https://github.com/mkayander/leetpal/compare/v1.5.0...v1.5.1) (2022-08-19)


### Bug Fixes

* Fixed session widget display ([a8a4080](https://github.com/mkayander/leetpal/commit/a8a4080a67b188cd5bde2ddfa76864076aa6783a))

# [1.5.0](https://github.com/mkayander/leetpal/compare/v1.4.0...v1.5.0) (2022-08-18)


### Features

* Added api tests page ([feb2abf](https://github.com/mkayander/leetpal/commit/feb2abf88da0a70a327e931404541b73b7c510c7))
* Added MUI theme setup ([44f68f8](https://github.com/mkayander/leetpal/commit/44f68f8550d421ff81de0ba159df623f6ca1c8f2))
* Added session widget component ([06dafd0](https://github.com/mkayander/leetpal/commit/06dafd08cb0786fd9668db6eb9707afadf52285d))

# [1.4.0](https://github.com/mkayander/leetpal/compare/v1.3.0...v1.4.0) (2022-08-14)


### Bug Fixes

* Move title tag to _app.tsx ([f6785c1](https://github.com/mkayander/leetpal/commit/f6785c1355e9db0a853c8ac0233757dc6fec31ab))


### Features

* Added main prisma scripts to package.json ([e4c3169](https://github.com/mkayander/leetpal/commit/e4c31697e43fec3506109534b6edab1eab3a20ca))
* Added NextAuth api endpoint controller ([c52e44c](https://github.com/mkayander/leetpal/commit/c52e44c169b370193ee308d9f222434f56c5d0c6))
* Updated Prisma package version ([7f39077](https://github.com/mkayander/leetpal/commit/7f39077847a7a810850a6019726b4390c2ce9adf))
* Use a more specific DB URL env variable name ([c1f2e8b](https://github.com/mkayander/leetpal/commit/c1f2e8b3bcd83e9e99d97d6c194ebdb6d9072d44))

# [1.3.0](https://github.com/mkayander/leetpal/compare/v1.2.0...v1.3.0) (2022-07-19)


### Features

* Introduced Material UI ([e1cf028](https://github.com/mkayander/leetpal/commit/e1cf028ca7364af8c1bd57581b712e75826fa016))

# [1.2.0](https://github.com/mkayander/leetpal/compare/v1.1.1...v1.2.0) (2022-07-18)


### Features

* Introduced NextAuth ([ddc760a](https://github.com/mkayander/leetpal/commit/ddc760ae919eeee8eb3c074a3b283886d48c01db))

## [1.1.1](https://github.com/mkayander/leetpal/compare/v1.1.0...v1.1.1) (2022-07-17)


### Bug Fixes

* Fixed tRPC api link in config ([d51ce3d](https://github.com/mkayander/leetpal/commit/d51ce3d7bf4d62fd6d37d26207010890c939a08a))

# [1.1.0](https://github.com/mkayander/leetpal/compare/v1.0.1...v1.1.0) (2022-07-17)


### Bug Fixes

* List prisma in dev packages ([d9b9028](https://github.com/mkayander/leetpal/commit/d9b90285572ac5008d6ac443b8b02d30c85ed14e))


### Features

* Introduced tRPC ([ee4fbc3](https://github.com/mkayander/leetpal/commit/ee4fbc3340b0326a8bc11dfb988ed31d9d64a05c))

## [1.0.1](https://github.com/mkayander/leetpal/compare/v1.0.0...v1.0.1) (2022-07-17)


### Bug Fixes

* Fixed plugins order in config ([1b1b18b](https://github.com/mkayander/leetpal/commit/1b1b18b2c2ae884246c7af95c9f5fd2f2f14f211))

# 1.0.0 (2022-07-17)


### Bug Fixes

* Added IDE files ([9d442aa](https://github.com/mkayander/leetpal/commit/9d442aae9785f7c4240fc2ad03dea308c53ef240))
* Formatting ([41cbc45](https://github.com/mkayander/leetpal/commit/41cbc45fe28c1d47eb67a0d7428e93434786fd3a))


### Features

* Added an "@src/*" path alias for TS ([e035637](https://github.com/mkayander/leetpal/commit/e035637c0b64602e3e9fed3fdb5a2eda8d4d7fd0))
* Added IDE meta file ([3ce94f9](https://github.com/mkayander/leetpal/commit/3ce94f98756629ab55c403a9ee02bff6335e461b))
* Added license ([937bd4d](https://github.com/mkayander/leetpal/commit/937bd4dbd57630dc0bf976ffd5332a2693605064))
* Introduced Prisma ([77c24f9](https://github.com/mkayander/leetpal/commit/77c24f97bce770110b5d32b429773d62e123b47d))
* Introduced Semantic Release ([6aab311](https://github.com/mkayander/leetpal/commit/6aab311ca837d3fa6c0ee3d8d234f5d169cec863))
* Moved NextJS pages source files to a "src" directory ([4351705](https://github.com/mkayander/leetpal/commit/4351705d92d19facc1b23ead27d28689a6f5e6cd))
* Updated semantic-release configuration ([b02a638](https://github.com/mkayander/leetpal/commit/b02a63874e32b9b876b573c8935f9552380e0420))
