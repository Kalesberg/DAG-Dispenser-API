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

createTransaction = async (params) => {
    let chainId = parseInt(config.CHAIN_ID)
    let nonce = await web3.eth.getTransactionCount(params.account)
    let gasPrice = await web3.eth.getGasPrice()
    gasPrice = parseInt(gasPrice * 1.1)

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
    return tx
}
sendTransaction = async (tx) => {
    let privateKey = new Buffer.from(config.WALLETKEY, 'hex')
    tx.sign(privateKey)
    let serializedTx = tx.serialize()
    
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
}
app.get('/', (req, res) => {
    res.send('Dispenser API works!')
})
app.post('/dispense', async (req, res, next) => {
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

    // contract.methods.transfer(address, amount_bn).send({from: config.WALLETADDRESS})
    // .on('transactionHash', hash => console.log(hash))
    
    let params = {
        account: config.WALLETADDRESS,
        data: contract.methods.transfer(address, amount_bn).encodeABI()
    }

    let tx = await createTransaction(params)
    // res.json({hash: '0x' + tx.hash().toString('hex')})
    // console.log(tx.hash())
    let txHash
    // try {
        txHash = await sendTransaction(tx)
    // } catch(err) {
        // return next('Problem during transaction')
    // }
    res.json(txHash)
    return next()
})

app.listen(config.PORT, () => console.log(`Token Dispenser API - listening on port ${config.PORT}`))