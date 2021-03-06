const abi = require('./abi')
const CONFIG = {
    // HTTP_PROVIDER: process.env.HTTP_PROVIDER || 'http://localhost:8545',
    // WALLETADDRESS: process.env.WALLETADDRESS || '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
    // WALLETKEY: process.env.WALLETKEY || 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
    // CONTRACTADDRESS: process.env.CONTRACTADDRESS || '0x8cdaf0cd259887258bc13a92c0a6da92698644c0',
    // CHAIN_ID: process.env.CHAIN_ID || 1337,
    // DECIMALS: 8,
    // ABI: abi,
    // SECRET: process.env.SECRET || 'secret',
    // PORT: process.env.PORT || 3000
    HTTP_PROVIDER: 'https://ropsten.infura.io/nAp458BQNRGwQ3Fynkd5',
    WALLETADDRESS: '0x225103715ab26f6579ef0d391e7764f95e547528',
    WALLETKEY: '5EFB5440C9E7D544CEB8B602FC08A5E2A10C3B080B873D7A60A25044F6115556',
    CONTRACTADDRESS: '0x0Dc5474Df75373094E3D63D085D6d8A3D36a3385',
    CHAIN_ID: 3,
    DECIMALS: 8,
    ABI: abi,
    SECRET: process.env.SECRET || 'HLj3b89blMa-PkT2SKmyJA',
    PORT: process.env.PORT || 3000
}

module.exports = CONFIG