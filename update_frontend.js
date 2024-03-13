

const fs = require("fs")

const frontEndContractsFile = "./frontend/constants/contractAddresses.json"
const contractAddresses = "./config.json"

async function main () {
    
    
    const contractAddresses1 = JSON.parse(fs.readFileSync(contractAddresses, "utf8"))
    
    
    fs.writeFileSync(frontEndContractsFile, `{"11155420":["${contractAddresses1.createChannel.srcAddr}"]}`)
    
}

// {"11155420":["0x2DE11c0BCb11E83D81CB60232b277EF2EED23d5D"]}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });