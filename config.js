const abi = require('./abi')
const CONFIG = {
    HTTP_PROVIDER: process.env.HTTP_PROVIDER || 'http://localhost:8545',
    WALLETADDRESS: process.env.WALLETADDRESS || '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
    WALLETKEY: process.env.WALLETKEY || 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
    CONTRACTADDRESS: process.env.CONTRACTADDRESS || '0x8cdaf0cd259887258bc13a92c0a6da92698644c0',
    CHAIN_ID: process.env.CHAIN_ID || 1337,
    DECIMALS: 8,
    ABI: abi,
    SECRET: 'secret'
}

module.exports = CONFIG