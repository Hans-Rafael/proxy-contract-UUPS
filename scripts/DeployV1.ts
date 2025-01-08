//author: Hans Garcia
import { ethers, upgrades } from "hardhat";

const InitialText = "Hello World";
async function main() {
  console.log("Deploying the first ContractV1...");
  // Obtener la fábrica del contrato
  const ContractV1 = await ethers.getContractFactory("ContractV1");
  // Desplegar utilizando el patrón UUPS
  const contractV1 = await upgrades.deployProxy(ContractV1, [InitialText], {
    initializer: "initialize", // nombre de la función de inicialización en el contrato
    kind: "uups", // tipo de proxy a utilizar(indicar siempre por seguridad)
  });
  // Espera la confirmación de que el proxy está completamente desplegado
  await contractV1.waitForDeployment();

  // Obtener dirección del proxy
  const proxyAddress = await contractV1.getAddress();
  console.log("ContractV1 deployed to Proxy Address:", proxyAddress);

  // Obtener la dirección de la implementación
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );
  console.log("Implementation Address:", implementationAddress);

  // Obtener la dirección del propietario (Owner)
  const ownerAddress = await contractV1.owner();
  console.log("Owner Address:", ownerAddress);

  // Guardar direcciones en .env
  const fs = require("fs");
  fs.writeFileSync(
    ".env",
    `PROXY_ADDRESS=${proxyAddress}\nIMPLEMENTATION_ADDRESS=${implementationAddress}\nOWNER_ADDRESS=${ownerAddress}\n`,
    { flag: "a" }
  );
  console.log("Direcciones guardadas en .env");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
