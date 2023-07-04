const express = require('express')
const { addStockOpname, getAllStockOpname, getAllStockOpnameDetails } = require('./stockOpnameDAO')
const router = express.Router()

router.post('/addStockOpname', async (req, res) => {
    const barang = req.body.barang
    const usernameId = req.body.usernameId
    const tanggalSo = req.body.tanggalSo
    const lokasiGudangId = req.body.lokasiGudangId

    const result = await addStockOpname(barang, usernameId, tanggalSo, lokasiGudangId)
    // console.log("hasil add stock opname ", result)
    if(result.affectedRows > 0){
        res.send({"message": "ok"})
    } else {
        res.send({"message": "error"})
    }
})

router.post('/getAllStockOpname', async (req, res) => {
    const lokasiGudangId = req.body.lokasiGudangId
    const result = await getAllStockOpname(lokasiGudangId)
    res.send(result)
})

router.post('/getAllStockOpnameDetails', async (req, res) => {
    const stockOpnameId = req.body.stockOpnameId
    const result = await getAllStockOpnameDetails(stockOpnameId)
    res.send(result)
})

module.exports = router