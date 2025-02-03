v1.1.3: Prem's audit and its resolution
- See the list of issues found and resolved in [the audit resolution doc](./audits/1.1_Prem_resolution.md)
- See the audit methodology and issues found in [the original audit report](./audits/1.1_final_Prem.pdf)

v1.1.2: do not enable full privileges to zero address on contract initialization

v1.1.0: Contact Size Optimizations

- __Breaking Change:__ Solidity 0.8.4 is now required to compile the contracts (previously was 0.8.2).
- Replaced "access denied" error with string literal (0.4.22) with the custom error AccessDenied() (0.8.4)
- Introduced lighter modification of the "AccessControl" RBAC contract – "AccessControlCore" (RBAC-C).
  The 'core' version of the RBAC contract hides three rarely used external functions from the public ABI,
  making them internal and thus reducing the overall compiled implementation size.

  | old name             | old modifier | new name              | new modifier |
  |----------------------|--------------|-----------------------|--------------|
  | `isFeatureEnabled()` | `public`     | `isFeatureEnabled()`  | `internal`   |
  | `isSenderInRole()`   | `public`     | `_isSenderInRole()`   | `internal`   |
  | `isOperatorInRole()` | `public`     | `_isOperatorInRole()` | `internal`   |

- Added `_requireSenderInRole()` and `_requireAccessCondition()` internal functions for a convenient and gas-efficient
  way of checking the access permissions and throwing the AccessDenied() error.
- Added the CHANGELOG (this file)

v1.0.7:
- Exported the RBAC behavior

v1.0.6:
- Updated the documentation

v1.0.5:
- Exported RBAC JavaScript constants and functions

v1.0.4:
- Fixed broken dependencies
- Upgraded npm libraries
- Added Sepolia network support

v1.0.3:
- Allowed lower versions of Hardhat to be used

v1.0.2:
- Optimized npm dependencies
