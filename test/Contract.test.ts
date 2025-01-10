import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("UUPS Proxy Pattern Test Suite", function () {
  let ContractV1Factory: any;
  let ContractV2Factory: any;
  let proxy: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ContractV1 as a proxy
    ContractV1Factory = await ethers.getContractFactory("ContractV1");
    proxy = await upgrades.deployProxy(ContractV1Factory, ["Initial Data"], {
      initializer: "initialize",
      kind: "uups",
    });
    await proxy.waitForDeployment();

    console.log("Proxy deployed at:", await proxy.getAddress());
  });

  it("should initialize ContractV1 correctly", async () => {
    const data = await proxy.getData();
    expect(data).to.equal("Initial Data");

    const proxyOwner = await proxy.owner();
    expect(proxyOwner).to.equal(owner.address);
  });

  it("should update data in ContractV1", async () => {
    await proxy.setData("Updated Data");
    const data = await proxy.getData();
    expect(data).to.equal("Updated Data");
  });

  describe("Upgrading to ContractV2", () => {
    before(async () => {
      ContractV2Factory = await ethers.getContractFactory("ContractV2");
      proxy = await upgrades.upgradeProxy(proxy, ContractV2Factory);
      await proxy.waitForDeployment();

      console.log("Proxy upgraded to ContractV2 at:", await proxy.getAddress());
    });

    it("should retain data from ContractV1", async () => {
      const data = await proxy.getData();
      expect(data).to.equal("Updated Data");
    });

    it("should update data and emit DataUpdated event", async () => {
      await expect(proxy.setData("New Data"))
        .to.emit(proxy, "DataUpdated")
        .withArgs("Updated Data", "New Data");

      const data = await proxy.getData();
      expect(data).to.equal("New Data");
    });

    it("should increment update count", async () => {
      const initialCount = await proxy.getUpdateCount();

      await proxy.setData("Another Update");
      const newCount = await proxy.getUpdateCount();

      //pect(newCount).to.equal(initialCount + 1);
      expect(BigInt(newCount)).to.equal(BigInt(initialCount) + BigInt(1));
    });

    it("should validate data in setData", async () => {
      await expect(proxy.setData("")).to.be.revertedWith("Data cannot be empty");
    });

    it("should perform addition using add function", async () => {
      const sum = await proxy.add(10, 15);
      expect(sum).to.equal(25);
    });

    it("should only allow the owner to upgrade", async () => {
      const ContractV2Factory = await ethers.getContractFactory("ContractV2");
      // Intenta actualizar el proxy como un usuario no propietario
      await expect(
        upgrades.upgradeProxy(proxy, ContractV2Factory.connect(addr1))
      ).to.be.revertedWithCustomError(proxy, "OwnableUnauthorizedAccount");//OpenZeppelin utiliza custom errors OwnableUnauthorizedAccount.
    });
  });
});
