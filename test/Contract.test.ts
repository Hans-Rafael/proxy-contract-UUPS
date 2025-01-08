import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("UUPS Proxy Pattern Test Suite", function () {
  let ContractV1: any;
  let ContractV2: any;
  let proxy: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let proxyAddress: string;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ContractV1
    const ContractV1Factory = await ethers.getContractFactory("ContractV1");
    proxy = await upgrades.deployProxy(ContractV1Factory, ["Initial Data"], {
      initializer: "initialize",
      kind: "uups",
    });
    await proxy.waitForDeployment();
    
    // Obtener la dirección del proxy de forma dinámica
    proxyAddress = await proxy.getAddress();  // Usar getAddress() en ethers 6.0
    console.log("Deployed Proxy Address:", proxyAddress);

    ContractV1 = ContractV1Factory.attach(proxyAddress);
  });

  it("should initialize ContractV1 correctly", async () => {
    const data = await ContractV1.getData();
    expect(data).to.equal("Initial Data");

    const proxyOwner = await proxy.owner();
    expect(proxyOwner).to.equal(owner.address);
  });

  it("should update data in ContractV1", async () => {
    await ContractV1.setData("Updated Data");
    const data = await ContractV1.getData();
    expect(data).to.equal("Updated Data");
  });

  describe("Upgrading to ContractV2", () => {
    before(async () => {
      // Fábrica del contrato V2
      const ContractV2Factory = await ethers.getContractFactory("ContractV2");
      // confirmars que proxyAddress no sea nula o undefined
      if (!proxyAddress) {
        throw new Error("Proxy Address is not available.");
      }
      console.log("Upgrading proxy to ContractV2 at address:", proxyAddress);
      // Actualizar el contratoV1 a la versión 2
      proxy = await upgrades.upgradeProxy(proxyAddress, ContractV2Factory);
      // Esperar confirmación del despliegue
      await proxy.waitForDeployment();
      //
      const proxy2Address = await proxy.getAddress();  // Usar getAddress() en ethers 6.0
      console.log("New Proxy Address:", proxy2Address);
      ContractV2 = ContractV2Factory.attach(proxy2Address);
    });

    it("should retain data from ContractV1", async () => {
      const data = await ContractV2.getData();
      expect(data).to.equal("Updated Data");
    });

    it("should use new functionality from ContractV2", async () => {
      const newData = await ContractV2.getNewData();
      expect(newData.trim()).to.equal("Updated Data (updated in V2)"); // Usando .trim() para ignorar espacios
    });

    it("should perform addition using new add function", async () => {
      const sum = await ContractV2.add(5, 7);
      expect(sum).to.equal(12);
    });

    it("should emit DataUpdated event when updating data", async () => {
      // Asegurándonos de que el evento DataUpdated sea emitido correctamente
      await expect(ContractV2.setData("New Data"))
        .to.emit(ContractV2, "DataUpdated")
        .withArgs("Updated Data", "New Data");

      const data = await ContractV2.getData();
      expect(data).to.equal("New Data");
    });

    it("should only allow owner to upgrade", async () => {
      const ContractV2Factory = await ethers.getContractFactory("ContractV2");
      // Intentamos hacer la actualización con addr1, que no es el propietario
      await expect(
        upgrades.upgradeProxy(proxy.getAddress(), ContractV2Factory.connect(addr1))  // Cambiar proxy.address por proxy.getAddress()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
