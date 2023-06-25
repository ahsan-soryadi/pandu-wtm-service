const express = require('express')
const { addStockPO, checkNoPO } = require('./stockModule')
const router = express.Router()

router.post('/createStockPO', async (req, res) => {
    console.log(req.body)
    if(Object.keys(req.body).length > 0){
        const result = await addStockPO(req.body)
        // console.log(result)
        if(result){
            res.send(result)
        } else {
            res.send({"message": "error"})
        }
    } else {
        res.send({"message": "error"})
        console.log("data kosong")
    }
    
})

router.post('/checkNoPO', async (req, res) => {
    const noPO = req.body.noPO ? req.body.noPO : ''
    console.log(await checkNoPO(noPO))
    const result = await checkNoPO(noPO)
    if(result.length > 0){
        res.send({isNoPOExist: true})
    } else {
        res.send({isNoPOExist: false})
    }
    
})

module.exports = router