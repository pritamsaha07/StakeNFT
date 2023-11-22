const express = require('express');
const Web3 = require('web3');
const Itemcontract = require('./artifacts/contracts/App.sol/Item.json');
const poolcontract = require('./artifacts/contracts/App.sol/Pool.json');
const Itemaddress = '0x97c22CbefB9Ee4F06FddBA69CffcF830cbd8F9BD';
const Pooladdress = '0x7D66E16D04887b5E9dAEF7091b521626BFAd8fe1';
const rpcEndpoint = 'https://rpc.sepolia.org';
const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));

const contract1 = new web3.eth.contract(Itemcontract.abi, Itemaddress);
const contract2 = new web3.eth.contract(poolcontract.abi, Pooladdress);
console.log(contract1);
console.log(contract2);

app.use(express.json());

app.post('/approve', async (req, res) => {
    const { tokenId } = req.body;
    const accounts = await web3.eth.getAccounts();
    const result = await contract1.methods.approve(Pooladdress, tokenId).send({ from: accounts[0],gasLimit: 2000000 });
    res.json({ message: 'Approved successfully' });
});

app.post('/deposit', async (req, res) => {
    const { tokenId } = req.body;
    const accounts = await web3.eth.getAccounts();
    const result = await contract2.methods.depositNFT(tokenId).send({ from: accounts[0], gasLimit: 2000000 });
    res.json({ message: 'Deposit successfully' });
});

app.post('/withdraw', async (req, res) => {
    const { tokenId } = req.body;
    const accounts = await web3.eth.getAccounts();
    const result = await contract2.methods.withdrawNFT(tokenId).send({ from: accounts[0], gasLimit: 2000000  });
    res.json({ message: 'Withdraw successfully' });
});

app.post('/claimreward', async (req, res) => {
    const { tokenId } = req.body;
    const accounts = await web3.eth.getAccounts();
    const result = await contract2.methods.claimReward().send({ from: accounts[0],  gasLimit: 2000000  });
    res.json({ message: 'Withdraw successfully' });
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
