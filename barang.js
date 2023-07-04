const express = require('express')
const { getAllBarangCatalogue, getBarangBySerialNumber, editPeruntukanBarang, getAllBarangByLocation, checkSerialNumber } = require('./barangDAO')
const { editPeruntukan } = require('./peruntukanDAO')
const router = express.Router()

router.post('/getAllBarangCatalogue', async (req, res) => {
    const locationId = req.body
    const result = await getAllBarangCatalogue(locationId)
    res.send(result)
})

router.post('/getAllBarangByLocation', async (req, res) => {
    const locationId = req.body
    const result = await getAllBarangByLocation(locationId)
    res.send(result)
})

router.post('/getBarangBySerialNumber', async (req, res) => {
    const serialNumber = req.body
    // console.log(req.body)
    const result = await getBarangBySerialNumber(serialNumber)
    if(result.length > 0){
        res.send({"message": "ok", "data": result})
    } else {
        res.send({"message":"error"})
    }
})

router.post('/editPeruntukanBarang', async (req, res) => {
    const barang = req.body
    const alasan = barang.alasan
    const peruntukanBaru = barang.peruntukan
    const barangResult = await editPeruntukanBarang(barang)
    const result = await editPeruntukan({...barangResult[0], alasan, peruntukanBaru})
    // console.log(result)
    if(result.affectedRows > 0){
        res.send({"message": "ok"})
    } else {
        res.send({"message": "error"})
    }
})

router.post('/checkSerialNumberByJenis', async (req, res) => {
    const serialNumber = req.body.serialNumber
    const locationId = req.body.locationId
    const jenisBarang = req.body.jenisBarang
    const result =  await checkSerialNumber(serialNumber, locationId, jenisBarang)
    res.send({"serialNumber": serialNumber ,"isSerialNumberExist": result[0]})
})

module.exports = router