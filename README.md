# Proyecto: Contratos Inteligentes con UUPS Proxy Pattern

Este proyecto demuestra cómo crear y probar dos versiones de un contrato inteligente utilizando el Patrón Proxy UUPS (Upgradeable Proxy Standard) con OpenZeppelin, Hardhat y TypeScript.

## Descripción

El estándar UUPS (Universal Upgradeable Proxy Standard) permite implementar contratos inteligentes que pueden actualizarse mientras mantienen los datos persistentes a través de un proxy. En este proyecto:

- **Versión 1 (ContractV1):** Un contrato base que implementa el estándar UUPS.
- **Versión 2 (ContractV2):** Una actualización del contrato que agrega nuevas funcionalidades, manteniendo la estructura del estándar UUPS.

Ambos contratos utilizan la librería de OpenZeppelin para garantizar la seguridad y compatibilidad con el estándar UUPS.

## Requisitos Previos

- Node.js y npm instalados.
- Hardhat configurado en el proyecto.
- Conocimientos básicos de Solidity y TypeScript.

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <URL del repositorio>
   cd <directorio del proyecto>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Estructura del Proyecto

- **contracts/**: Carpeta que contiene los contratos Solidity:
  - `ContractV1.sol`: Primera versión del contrato.
  - `ContractV2.sol`: Versión actualizada del contrato.
- **scripts/**: Contiene los scripts de despliegue:
  - `deployV1.ts`: Despliega la primera versión del contrato con un proxy.
  - `deployV2.ts`: Actualiza el contrato a la versión 2.
- **test/**: Pruebas unitarias para verificar la funcionalidad del contrato.

## Contratos

### ContractV1

- Implementa:
  - `Initializable`
  - `OwnableUpgradeable`
  - `UUPSUpgradeable`
- Incluye una función `initialize` en lugar de un constructor.
- Define la función `_authorizeUpgrade` para restringir actualizaciones al propietario.
- Proporciona funcionalidades básicas para establecer y obtener un dato de tipo `string`.

### ContractV2

- Hereda de `ContractV1`.
- Agrega nuevas funcionalidades:
  - Una función sobrescrita `setData` con registro de eventos para rastrear actualizaciones de datos.
  - Una nueva función `getNewData` para obtener datos concatenados.
  - Una función adicional `add` para realizar sumas básicas.
- Conserva la función `_authorizeUpgrade` para cumplir con el estándar UUPS.

## Despliegue

### Despliegue de ContractV1

1. Las variables necesarias para el deploy de la version 2 del contrato se guardan en el archivo `.env` una vez que se despliega la version 1 del contrato:

   ```env
   PROXY_ADDRESS=<direccion_del_proxy>
   IMPLEMENTATION_ADDRESS=<direccion_del_contrato>
   OWNER_ADDRESS=<direccion_del_owner>
   ```

2. Ejecuta el script de despliegue para la versión 1:

   ```bash
   npx hardhat run scripts/deployV1.ts --network localhost
   ```

3. Verifica que la dirección del proxy y el propietario se guarden automáticamente en `.env`.

### Actualización a ContractV2

1. Asegúrate de que el contrato proxy esté desplegado y configurado en `.env`.

2. Ejecuta el script de despliegue para actualizar a la versión 2:

   ```bash
   npx hardhat run scripts/deployV2.ts --network localhost
   ```

3. Verifica que la actualización se haya realizado correctamente revisando los eventos registrados y las nuevas funcionalidades disponibles.

## Pruebas

Ejecuta las pruebas unitarias para validar la funcionalidad del contrato:

```bash
npx hardhat test
```

## Notas Técnicas

- **Seguridad:** La función `_authorizeUpgrade` utiliza `onlyOwner` para restringir actualizaciones.
- **Datos persistentes:** El almacenamiento del proxy no se ve afectado por las actualizaciones del contrato.
- **Eventos:** Se registran eventos `ContractUpgraded` y `DataUpdated` en cada actualización exitosa y cambio de datos, respectivamente.
- **Variables en `.env`:** Se almacenan las direcciones del proxy, el propietario y la implementación actual para facilitar el acceso y pruebas en futuros despliegues.

## Recursos

- [Documentación de OpenZeppelin](https://docs.openzeppelin.com/)
- [Hardhat](https://hardhat.org/)
- [Patrón Proxy UUPS](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable)

## Licencia

Este proyecto está bajo la Licencia MIT.
