/**
 * default Hardhat configuration which uses account mnemonic to derive accounts
 */

// Enable Truffle 5 plugin for tests
// https://hardhat.org/guides/truffle-testing.html
require("@nomiclabs/hardhat-truffle5");

// enable Solidity-coverage
// https://hardhat.org/plugins/solidity-coverage.html
require("solidity-coverage");

// enable hardhat-gas-reporter
// https://hardhat.org/plugins/hardhat-gas-reporter.html
require("hardhat-gas-reporter");

// copy compiled Solidity bytecode directly from the NPM dependencies.
// https://github.com/vgorin/hardhat-dependency-injector
require("hardhat-dependency-injector");

// automatically generate TypeScript bindings for smart contracts while using Hardhat
// TypeScript bindings help IDEs to properly recognize compiled contracts' ABIs
// https://github.com/dethcrypto/TypeChain/tree/master/packages/hardhat
// npm install -D typechain @typechain/hardhat @typechain/truffle-v5
// run: npx hardhat typechain
// require("@typechain/hardhat");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		// https://hardhat.org/hardhat-network/
		hardhat: {
			// set networkId to 0xeeeb04de as for all local networks
			chainId: 0xeeeb04de,
			// set the gas price to one for convenient tx costs calculations in tests
			// gasPrice: 1,
			// London hard fork fix: impossible to set gas price lower than baseFeePerGas (875,000,000)
			initialBaseFeePerGas: 0,
			accounts: {
				count: 35,
			},
		},
	},

	// Configure Solidity compiler
	solidity: {
		// https://hardhat.org/guides/compile-contracts.html
		compilers: [
			{
				version: "0.8.28",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			},
		]
	},

	// configure typechain to generate Truffle v5 bindings
	typechain: {
		outDir: "typechain",
		target: "truffle-v5",
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000,

		// disable mocha timeouts:
		// https://mochajs.org/api/mocha#enableTimeouts
		enableTimeouts: false,
		// https://github.com/mochajs/mocha/issues/3813
		timeout: false,
	},

	// hardhat-gas-reporter will be disabled by default, use REPORT_GAS environment variable to enable it
	// https://hardhat.org/plugins/hardhat-gas-reporter.html
	gasReporter: {
		enabled: !!(process.env.REPORT_GAS)
	},

	// copy compiled Solidity bytecode directly from NPM dependencies
	// https://github.com/vgorin/hardhat-dependency-injector
	dependencyInjector: {
		paths: [
			// ERC1967 is used to deploy upgradeable contracts
			"@openzeppelin/contracts/build/contracts/ERC1967Proxy.json",
		],
	},
}
