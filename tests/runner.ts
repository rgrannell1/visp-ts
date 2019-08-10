
import setTests from './index';

setTests.run({ report: true }).catch((err:Error) => {
  throw err;
})
