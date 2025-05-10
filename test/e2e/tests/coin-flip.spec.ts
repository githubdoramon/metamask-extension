import { Suite } from 'mocha';

describe('Coin flip', function (this: Suite) {
  it('test 1', async function () {
    if (Math.random() < 0.5) {
      console.log(`Coin flip is heads, ${this.test?.fullTitle()} succeeded.`);
    } else {
      const message = `Coin flip is tails, ${this.test?.fullTitle()} failed.`;
      console.log(message);
      throw new Error(message);
    }
  });

  it('test 2', async function () {
    if (Math.random() < 0.5) {
      console.log(`Coin flip is heads, ${this.test?.fullTitle()} succeeded.`);
    } else {
      const message = `Coin flip is tails, ${this.test?.fullTitle()} failed.`;
      console.log(message);
      throw new Error(message);
    }
  });
});
