var Example = artifacts.require("Hello"); // import compiled for the example.

module.exports = function (deployer) {
    deployer.deploy(Example);
}