const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const BigNumber = require('bignumber.js')
const jwt = require('jsonwebtoken')

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const whitelist = [
    'http://constellationlabs.io', 'https://constellationlabs.io',,
    'http://orion.constellationlabs.io', 'https://orion.constellationlabs.io',
    'http://anand-crowdbotics-188.herokuapp.com', 'https://anand-crowdbotics-188.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Request not allowed'))
        }
    }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


const config = require('./config')
const web3 = new Web3(config.HTTP_PROVIDER)
const contract = new web3.eth.Contract(config.ABI, config.CONTRACTADDRESS)

sendTransaction = async (params) => {
    let chainId = parseInt(config.CHAIN_ID)
    let nonce = await web3.eth.getTransactionCount(params.account)
    let gasPrice = await web3.eth.getGasPrice()

    let eth = params.eth || '0'

    let txParams = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(4700000),
        from: params.account,
        to: config.CONTRACTADDRESS,
        value: web3.utils.toHex(web3.utils.toWei(eth, 'ether')),
        chainId: chainId,
        data: (params.data || '')
    };

    let tx = new Tx(txParams)
    let privateKey = new Buffer.from(params.key, 'hex')
    tx.sign(privateKey)
    let serializedTx = tx.serialize()

    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
}
app.get('/', (req, res) => {
    res.send(config)
    // res.send('Dispenser API works!')
})
app.post('/dispense', async (req, res, next) => {
    console.log(req.hostname)
    let token = req.body.token
    let address = req.body.wallet
    let amount = req.body.amount
    let amount_bn = new BigNumber(req.body.amount * (10 ** config.DECIMALS))

    let decoded = {}
    try {
        decoded = jwt.verify(token, config.SECRET)
        decoded = Object.assign({wallet: '', amount: 0, exp: 0}, decoded)
    } catch(err) {
        return next('Invalid signature')
    }

    if (decoded.wallet.toLowerCase() != address.toLowerCase() || decoded.amount != amount) {
        return next('Token mismatch')
    }
    if (decoded.exp * 1000 < (new Date).valueOf()) {
        return next('Token expired')
    }
    
    let params = {
        account: config.WALLETADDRESS,
        key: config.WALLETKEY,
        data: contract.methods.transfer(address, amount_bn).encodeABI()
    }

    let txHash
    try {
        txHash = await sendTransaction(params)
    } catch(err) {
        return next('Problems during sending tokens')
    }

    res.json(txHash)
    return next()
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Token Dispenser API - listening on port ${PORT}`))