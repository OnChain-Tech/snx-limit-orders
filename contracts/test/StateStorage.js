const { expect } = require("chai");

describe("StateStorage", function() {


    const addressZero = "0x0000000000000000000000000000000000000000";
    const hashZero = "0x0000000000000000000000000000000000000000000000000000000000000000"

  it("Should expose synthetixContract and exchangeRatesContract addresses after deployment", async function() {
    // We simulate a proxy contract address with an external account (signer)
    const [proxy] = await ethers.getSigners();
    const synthetixContract = "0x0000000000000000000000000000000000000001"
    const exchangeRatesContract = "0x0000000000000000000000000000000000000002"
    const StateStorage = await ethers.getContractFactory("StateStorage");
    const stateStorage = await StateStorage.deploy(await proxy.getAddress(), synthetixContract, exchangeRatesContract);
    await stateStorage.deployed();
    expect(await stateStorage.synthetix()).to.equal(synthetixContract);
    expect(await stateStorage.exchangeRates()).to.equal(exchangeRatesContract);
  });

  it("Should allow only the proxy address to createOrder", async function() {
    const [proxy, addr1] = await ethers.getSigners();
    const StateStorage = await ethers.getContractFactory("StateStorage");
    const stateStorage = await StateStorage.deploy(await proxy.getAddress(), addressZero, addressZero);
    await stateStorage.deployed();
    await stateStorage.connect(proxy).createOrder(addressZero, hashZero, 1, hashZero, 1, 1, 1, false)
    expect(await stateStorage.latestID()).to.equal(1);
    try {
        await stateStorage.connect(addr1).createOrder(addressZero, hashZero, 1, hashZero, 1, 1, 1, false)
        expect(await stateStorage.latestID()).to.equal(1);
    } catch(e) {
        expect(await stateStorage.latestID()).to.equal(1);
    }
  });

  it("Should allow anyone to getOrder", async function() {
    const [proxy, addr1] = await ethers.getSigners();
    const StateStorage = await ethers.getContractFactory("StateStorage");
    const stateStorage = await StateStorage.deploy(await proxy.getAddress(), addressZero, addressZero);
    await stateStorage.deployed();
    const submitter = "0x0000000000000000000000000000000000000001"
    await stateStorage.connect(proxy).createOrder(submitter, hashZero, 1, hashZero, 1, 1, 1, false)
    expect((await stateStorage.connect(addr1).getOrder(1))[0]).to.equal(submitter);
  });
})