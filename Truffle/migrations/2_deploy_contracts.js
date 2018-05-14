var StringExtensionCode = artifacts.require("StringExtension"); // import the compiled bytecode/ABI

// Export the smart contract as a JS object.
module.exports = function (deployer) {
    deployer.deploy(StringExtensionCode);
}
