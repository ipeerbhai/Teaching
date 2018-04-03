var HelloContract = artifacts.require("HelloContract");

module.exports = function(deployer) {
    deployer.deploy(HelloContract);
}