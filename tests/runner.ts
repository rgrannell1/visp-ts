
import parserTests from './index';

parserTests.run({ report: true }).catch((err:Error) => {
  throw err;
})
