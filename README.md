# Upgradeable Role-based Access Control (U-RBAC) #
An [OZ Upgradeable](https://docs.openzeppelin.com/contracts/4.x/api/proxy)
version of the [Role-based Access Control (RBAC)](https://github.com/lazy-sol/access-control)

A shortcut to a modular and easily pluggable dapp architecture.

Enable the modular plug and play (PnP) architecture for your dapp by incorporating the role-based access control (RBAC)
into the smart contracts.

## Audit(s)
* [v1.1 Audit by Prem, January 1–30, 2025](./audits/1.1_final_Prem.pdf)
  * [Resolution: v1.1 Audit by Prem](./audits/1.1_Prem_resolution.md)

## Technical Overview

Role-based Access Control (RBAC), or simply Access Control, is the base parent contract to be inherited by other smart
contracts wishing to enable the RBAC feature. It provides an API to check if a specific operation is permitted globally
and/or if a particular user has a permission to execute it.

It deals with two main entities: features and roles. Features are designed to be used to enable/disable public functions
of the smart contract (used by a wide audience). User roles are designed to control the access to restricted functions
of the smart contract (used by a limited set of maintainers).

When designing the RBAC-enabled contract, the best practice is to make all public mutative functions controlled with
their corresponding feature flags, which can be enabled/disabled during smart contact deployment, setup process, and,
optionally, during contract operation.

Restricted access functions must be controlled by their corresponding user roles/permissions and usually can be executed
by the deployer during smart contract deployment and setup process.

After deployment is complete and smart contract setup is verified the deployer should enable the feature flags and
revoke own permissions to control these flags, as well as permissions to execute restricted access functions.

It is possible that smart contract functionalities are enabled in phases, but the intention is that eventually it is
also possible to set the smart contract to be uncontrolled by anyone and be fully decentralized.

It is also possible that the deployer shares its admin permissions with other addresses during the deployment and setup
process, but eventually all these permissions can be revoked from all the addresses involved.

Following diagram summarizes stated below:

![Role-based Access Control (RBAC) Lifecycle](Role-based%20Access%20Control%20%28RBAC%29%20Lifecycle.png)  
Diagram 1. RBAC-enabled smart contract deployment and setup phases. Contract evolves from the fully controlled in the
initial phases of the setup process to the fully decentralized and uncontrolled in the end.

It is important to note that it is not necessary, and not recommended to wait until the last “Setup Complete” phase is
executed to consider the protocol fully operational in the mainnet. In fact, the best practice is to do the launch after
the deployer permissions are revoked, but there are admin multisig accounts with the full permissions to control the
protocol. This kind of approach allows reacting to the security issues, which are more likely to happen in the beginning
of the protocol operation.

## Special Permissions Mapping

Special permissions mapping, `userRoles`, stores special permissions of the smart contract administrators and helpers.
The mapping is a part of AccessControl and is inherited by the smart contracts using it.

The value stored in the mapping is a 256 bits unsigned integer, each bit of that integer represents a particular
permission. We call a set of permissions a role. Usually, roles are defined as 32 bits unsigned integer constants, but
extension to 255 bits is possible.

Permission with the bit 255 set is a special one. It corresponds to the access manager role `ROLE_ACCESS_MANAGER`
defined on the Access Control smart contract and allows accounts having that bit set to grant/revoke their permissions
to other addresses and to enable/disable corresponding features of the smart contract (to update self address “this”
role – see below).

Self address “this” mapping is a special one. It represents the deployed smart contract itself and defines features
enabled on it. Features control what public functions are enabled and how they behave. Usually, features are defined as
32 bits unsigned integer constants, but extension to 255 bits is possible.

Access Control is a shared parent for other smart contracts which are free to use any strategy to introduce their
features and roles. Usually, smart contracts use different values for all the features and roles (see the table in the
next section).

Access manager may revoke its own permissions, including the bit 255. Eventually that allows an access manager to let
the smart contract “float freely” and be controlled only by the community (via the DAO) or by no one at all.

## Comparing with OpenZeppelin

Both our and OpenZeppelin Access Control implementations feature a similar API to check/know "who is allowed to do this
thing".

Zeppelin implementation is more flexible:
* it allows setting an unlimited number of roles, while current is limited to 256 different roles
* it allows setting an admin for each role, while current allows having only one global admin

Our implementation is more lightweight:
* it uses only 1 bit per role, while Zeppelin uses 256 bits
* it allows setting up to 256 roles at once, in a single transaction, while Zeppelin allows setting only one role in a
  single transaction

## Initialization

Initializable Role-based Access Control (U-RBAC), or simply Initializable Access Control is a Role-based Access Control
variant utilizing an initialization function `_postConstruct` instead of the constructor. It follows the
[OZ Initializable](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers) pattern.

Contracts, inheriting from Initializable Access Control must be deployed via proxies. This doesn't necessarily mean
upgradeability, however – immutable EIP-1167 Minimal Proxy can also be used.

## Upgradeability

Upgradeable Role-based Access Control (U-RBAC), or simply Upgradeable Access Control is a Role-based Access Control
extension supporting the OpenZeppelin UUPS Proxy upgrades. Smart contracts inheriting from the
`UpgradeableAccessControl` can be deployed behind the ERC1967 proxy and will get the upgradeability mechanism setup.

Upgradeable Access Control introduces another “special” permission bit 254 which is reserved for an upgrade manager role
`ROLE_UPGRADE_MANAGER` which is allowed to and is responsible for implementation upgrades of the ERC1967 Proxy.

Being controlled by the upgrade manager, the upgradeability is also a revocable feature of the smart contract: the
`upgradeTo` restricted function access can be revoked from all the admin accounts.

The best practice is to disable contract upgradeability when the protocol is mature enough and has already proven its
security and stability.

## Installation
```
npm i -D @lazy-sol/access-control-upgradeable
```

## Usage

### Creating a Restricted Function

Restricted function is a function with a `public` Solidity modifier access to which is restricted
so that only a pre-configured set of accounts can execute it.

1.  Enable role-based access control (RBAC) in a new smart contract
    by inheriting the RBAC contract from the [UpgradeableAccessControlCore](./contracts/UpgradeableAccessControlCore.sol) contract:
    ```solidity
    import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
    import "@lazy-sol/access-control/contracts/UpgradeableAccessControlCore.sol";
    
    /**
     * @title Simple ERC20 Implementation (Upgreadable)
     *
     * @notice Zeppelin based ERC20 implementation with the U-RBAC support
     *
     * @author Lazy So[u]l
     */
    contract MyUpgradeableERC20Token is ERC20Upgradeable, UpgradeableAccessControlCore {
        
        ...
        
    }
    ```

2.  Define an access control role with the unique integer value:
    ```solidity
        ...
        
        /**
         * @notice Token creator is responsible for creating (minting)
         *      tokens to an arbitrary address
         * @dev Role ROLE_TOKEN_CREATOR allows minting tokens
         *      (calling `mint` function)
         */
        uint32 public constant ROLE_TOKEN_CREATOR = 0x0001_0000;
        
        ...
    ```

3.  Add the `_requireSenderInRole(ROLE_TOKEN_CREATOR)` check into the function body:
    ```solidity
        ...
        
        /**
         * @inheritdoc ERC20Upgradeable
         */
        function _mint(address _to, uint256 _value) internal virtual override {
            // check if caller has sufficient permissions to mint tokens
            _requireSenderInRole(ROLE_TOKEN_CREATOR);

            // delegate to super implementation
            super._mint(_to, _value);
        }
        
        ...
    ```

    Note: it is also possible to use the `restrictedTo` modifier in the function declaration instead of the `require`
    in the function body if this better suits the coding style:
    ```solidity
        ...
        
        /**
         * @inheritdoc ERC20Upgradeable
         */
        function _mint(address _to, uint256 _value) internal virtual override restrictedTo(ROLE_TOKEN_CREATOR) {
            // delegate to super implementation
            super._mint(_to, _value);
        }
        
        ...
    ```

### Customizing the Error Message

Modifier `restrictedTo()`, internal functions `_requireSenderInRole()` and `_requireAccessCondition()` throw the
`AccessDenied` denied error when access check fails.

It is also possible to use your own custom errors or string messages if needed by leveraging a lower level boolean
functions `_isSenderInRole()` and `_isOperatorInRole()`:

```solidity
    ...
    
    /**
     * @inheritdoc ERC20Upgradeable
     */
    function _mint(address _to, uint256 _value) internal virtual override {
        // check if caller has sufficient permissions to mint tokens
        require(_isSenderInRole(ROLE_TOKEN_CREATOR), "access denied");

        // delegate to super implementation
        super._mint(_to, _value);
    }
    
    ...
```

Examples:
[AdvancedERC20](https://raw.githubusercontent.com/lazy-sol/advanced-erc20/master/contracts/token/AdvancedERC20.sol),
[ERC20v1](https://raw.githubusercontent.com/vgorin/solidity-template/master/contracts/token/upgradeable/ERC20v1.sol),
[ERC721v1](https://raw.githubusercontent.com/vgorin/solidity-template/master/contracts/token/upgradeable/ERC721v1.sol).

## See Also
[Role-based Access Control (RBAC)](https://github.com/lazy-sol/access-control/blob/master/README.md)

(c) 2017–2024 Basil Gorin
