const hre = require("hardhat");

async function main() {
  

  const Item = await hre.ethers.deployContract("Item");

  await Item.waitForDeployment();

  console.log(
    `Item contract deployed to: ${Item.target}`
  );

  if (!Item.target) {
    console.error("Item contract address is undefined. Aborting.");
    return;
  }

  const Pool = await ethers.getContractFactory("Pool");
  const pool = await Pool.deploy(Item.target);
  
  console.log("Pool contract deployed to:", pool.target);


  await Item.waitForDeployment();


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
