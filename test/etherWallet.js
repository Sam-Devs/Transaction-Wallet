// @ts-ignore
const EtherWallet = artifacts.require('EtherWallet');

// @ts-ignore
contract('EtherWallet', (accounts) => {
  let etherWallet;
  // @ts-ignore
  before(async () => {
    etherWallet = await EtherWallet.deployed();
  });


  // @ts-ignore
  it('Should set accounts[0] as owner', async () => {
    const owner = await etherWallet.owner();
    // @ts-ignore
    assert(owner === accounts[0]);
  });

  // @ts-ignore
  it('Should deposit ether to Wallet', async () => {
    await etherWallet.deposit({from: accounts[0], value: 100});
    // @ts-ignore
    const balance = await web3.eth.getBalance(etherWallet.address);
    // @ts-ignore
    assert(parseInt(balance) === 100);
  });

  // @ts-ignore
  it('Should return balance of wallet', async () => {
    const balance = await etherWallet.etherBalance();
    // @ts-ignore
    assert(parseInt(balance) === 100);
  });

  // @ts-ignore
  it('Should transfer ether to another address', async () => {
    // @ts-ignore
    const balanceRecipientBefore = await web3.eth.getBalance(accounts[1]);
    await etherWallet.sendEther(accounts[1], 50, {from: accounts[0]});
    // @ts-ignore
    const balanceWallet = await web3.eth.getBalance(etherWallet.address);
    // @ts-ignore
    assert(parseInt(balanceWallet) === 50);
    // @ts-ignore
    const balanceRecipientAfter = await web3.eth.getBalance(accounts[1]);
    // @ts-ignore
    const finalBalance = web3.utils.toBN(balanceRecipientAfter);
    // @ts-ignore
    const initialBalance = web3.utils.toBN(balanceRecipientBefore);
    // @ts-ignore
    assert(finalBalance.sub(initialBalance).toNumber() === 50);
  });

  // @ts-ignore
  it('Should NOT transfer ether if transaction not sent from owner', async () => {
    try {
      await etherWallet.sendEther(accounts[1], 50, {from: accounts[1]});
    } catch(e) {
      // @ts-ignore
      assert(e.message.includes('sender is not allowed'));
      return;
    }
    // @ts-ignore
    assert(false);
  });
});
