// @ts-check


// JEST_TEST_TAGS=db:0
// JEST_TEST_TAGS="Users:1;adapter:1"


/** @type { import( 'jest' ).Config } */
const config = {
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '_UNUSED_', '_DEPRECATED_', 'dist'],
  // cache: true,
  // cacheDirectory: path.resolve( __dirname, '.jestCache' ),
  // ...( JEST_COVERAGE === undefined ? {} : {
  //   collectCoverage: true,
  //   collectCoverageFrom: [
  //     './src/**',
  //     './migrations/**',
  //   ],
  // } ),
};

module.exports = config;
