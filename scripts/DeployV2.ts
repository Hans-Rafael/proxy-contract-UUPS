//author: Hans Garcia
import { ethers, upgrades } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();
//const PROXY = <<REPLACE_WITH_YOUR_PROXY_ADDRESS>>;
const proxyAddress = process.env.PROXY_ADDRESS;
async function main() {
  // Verificar si la dirección del proxy está definida
  if (!proxyAddress) {
    throw new Error("Proxy address is not defined in .env file.");
  }
  console.log("Original proxy addres", proxyAddress);
  // Fábrica del contrato V2
  const ContractV2 = await ethers.getContractFactory("ContractV2");
  console.log("updaitng to ContractV2...");
  
  // Validar que el signer sea el owner actual
  const proxy = await ethers.getContractAt("ContractV1", proxyAddress);
  const currentOwner = await proxy.owner();
  const signer = await ethers.provider.getSigner();
  const signerAddress = await signer.getAddress();

  if (currentOwner !== signerAddress) {
    throw new Error(
      `Signer is not the owner. Current owner: ${currentOwner}, Signer: ${signerAddress}`
    );
  }
  // Actualizar el contratoV1 a la versión 2
  const contractV2 = await upgrades.upgradeProxy(proxyAddress, ContractV2);
  // Esperar confirmación del despliegue
  await contractV2.waitForDeployment();
  //verificar are same address
  console.log("ContractV2 deployed to:", await contractV2.getAddress());
  // Obtener la dirección de la implementación
  const contractV2Address = await upgrades.erc1967.getImplementationAddress(
    await contractV2.getAddress()
  );
  console.log(`Dirección de la implementación: ${contractV2Address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
