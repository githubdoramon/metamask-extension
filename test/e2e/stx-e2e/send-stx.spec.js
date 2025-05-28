import {
  withFixtures,
  unlockWallet,
  openActionMenuAndStartSendFlow,
} from '../helpers';
import FixtureBuilder from '../fixture-builder';
import HeaderNavbar from '../page-objects/pages/header-navbar';
import AccountListPage from '../page-objects/pages/account-list-page';
import dotenv from 'dotenv';

dotenv.config();

describe('Send STX', function () {
  it('sends STX to another address', async function () {
    await withFixtures(
      {
        fixtures: new FixtureBuilder()
          .withPopularNetworks()
          .withNetworkController({
            selectedNetworkClientId: 'bnb-mainnet',
          })
          .build(),
        title: this.test.fullTitle(),
        localNodeOptions: 'none',
        dapp: false,
        disableMocking: true,
        disablePrivacySnapshotValidation: true,
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        // add private key (Account 7 from MMQA)
        const header = new HeaderNavbar(driver);
        await header.check_pageIsLoaded();
        await header.openAccountMenu();

        const accountListPage = new AccountListPage(driver);
        await accountListPage.check_pageIsLoaded();

        await accountListPage.openAccountOptionsMenu();
        await accountListPage.addNewImportedAccount(
          process.env.TEST_STX_PRIVATE_KEY,
        );

        // wait to have the balance loaded when send
        await driver.waitForSelector({
          text: `BNB`,
          tag: 'span',
        });

        await openActionMenuAndStartSendFlow(driver);
        await driver.fill(
          'input[placeholder="Enter public address (0x) or domain name"]',
          '0xf91B0678D0E3D593641d25e609784B799B72Fcc8',
        );

        const inputAmount = await driver.findElement('input[placeholder="0"]');

        await inputAmount.fill('0.00001');

        // Continue to next screen
        await driver.clickElement({ text: 'Continue', tag: 'button' });

        // add a check to avoid race condition
        await driver.delay(5000);

        await driver.wait(async () => {
          const nativeCurrencyElement = await driver.findElement(
            '[data-testid="native-currency"]',
          );
          const nativeCurrencyText = await nativeCurrencyElement.getText();
          const nativeCurrencyValue = parseFloat(
            nativeCurrencyText.replace(/[^0-9.-]+/g, ''),
          );
          return nativeCurrencyValue <= 0.01;
        }, 3000);

        await driver.clickElement({ text: 'Confirm', tag: 'button' });

        // await driver.clickElement({ text: 'View Activity', tag: 'button' });
        await driver.delay(2000);
        await driver.clickElement(
          '[data-testid="smart-transaction-status-page-footer-close-button"]',
        );

        await driver.clickElement(
          '[data-testid="account-overview__activity-tab"]',
        );

        // await driver.wait(async () => {
        //   const confirmedTxes = await driver.findElements(
        //     '.transaction-list__completed-transactions .activity-list-item',
        //   );
        //   if (confirmedTxes.length >= 2) {
        //     try {
        //       const firstTxElement = await confirmedTxes[0].findElement(
        //         '[data-testid="activity-list-item-action"]',
        //       );
        //       const secondTxElement = await confirmedTxes[1].findElement(
        //         '[data-testid="activity-list-item-action"]',
        //       );
        //       const firstTxType = await firstTxElement.getText();
        //       const secondTxType = await secondTxElement.getText();
        //       return firstTxType === 'Receive' && secondTxType === 'Send';
        //     } catch (e) {
        //       return false;
        //     }
        //   }
        //   return false;
        // }, 10000);

        await driver.waitForSelector({
          css: '[data-testid="transaction-list-item-primary-currency"]',
          text: '-0.00001 BNB',
        });

        const allTX = await driver.findElements(
          '[data-testid="activity-list-item"]',
        );
        console.log(allTX.length);
        const sentTX = await allTX.find((tx) =>
          tx.findElement({
            css: '[data-testid="activity-list-item-action"]',
            text: 'Send',
          }),
        );
        console.log(sentTX);
        await driver.wait(async () => {
          const completedTx = await sentTX.findElement(
            '.transaction-list__completed-transactions .activity-list-item',
          );
          return completedTx ? true : false;
        }, 10000);

        // assert.equal(
        //   (await driver.findElements('.transaction-status-label--confirmed'))
        //     .length,
        //   1,
        // );
      },
    );
  });
});
