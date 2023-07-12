## Info

Test app fetching and bundling data from `JIRA API`.

## Technical notes

This could have been setup with other dependencies like `axios` (to handle query string params more swiftly) or `lodash` (`omit` would be handy) but it seems like an overkill for such small app/function.
Therefore only dep. used is [pino](https://www.npmjs.com/package/pino) which is a simple logger.

Please use node v18 (or higher) because node-native `fetch API` is used.

## Commands

- run `npm i` install dependencies
- run `npm start` in order to start the app and generate _output.txt_ file
- run `npm run test` in order to start test suite
