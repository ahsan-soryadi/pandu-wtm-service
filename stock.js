const express = require('express')
const { addStockPO, checkNoPO, checkDataPO, getDataPO, addStockReady } = require('./stockDAO')
const { addBarang, checkSerialNumber } = require('./barangDAO')
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
    const result = await checkNoPO(noPO)
    if(result.length > 0){
        res.send({isNoPOExist: true})
    } else {
        res.send({isNoPOExist: false})
    }
    
})

router.post('/getDataPO', async (req, res) => {
    const noPO = req.body.noPO ? req.body.noPO : ''
    const result = await getDataPO(noPO)
    if(result.length > 0) {
        const resultMap = {
            noPO: result[0].no_PO,
            jenisBarang: result[0].jenis_barang,
            produkSeri: result[0].produk_seri,
            merkBarang: result[0].merk_barang,
            qtyPO: result[0].Qty_PO
        }
        res.send({'dataPO': resultMap})
    } else {
        res.send({'dataPO' : result})
    }
})

router.post('/addStockReady', async (req, res) => {
    const barang = req.body.data
    // console.log("barang dari req.body : ", barang)
    try {
       const result = await addStockReady(barang)
       if(result.affectedRows > 0 && result.warningStatus == 0){
        res.send({"message": "ok"})
       } else {
        res.send({"message": "error"})
       }
    } catch (error) {
        res.send({"message": "error"})
    }
})

router.post('/checkSerialNumber', async (req, res) => {
    const serialNumber = req.body.serialNumber
    const result =  await checkSerialNumber(serialNumber)
    res.send({"isSerialNumberExist": result})
})

module.exports = router