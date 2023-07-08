const express = require('express')
const { addPengirimanAg, getAllPengirimanAg, getAllPenerimaanAg, getPengirimanAgById, getDetailPengirimanAgById, addPenerimaanAg } = require('./pengirimanAgDAO')
const router = express.Router()

router.post('/addPengirimanAg', async (req, res) => {
    const tagEntries = req.body
    const result = await addPengirimanAg(tagEntries)
    if(result.affectedRows > 0) {
        res.send({"message": "ok"})
    } else {
        res.send({"message": "error"})
    }
})

router.post('/getAllpengirimanAg', async (req, res) => {
    const locationId = req.body.locationId
    const result = await getAllPengirimanAg(locationId)
    res.send(result)
})

router.post('/getAllpenerimaanAg', async (req, res) => {
    const locationId = req.body.locationId
    const result = await getAllPenerimaanAg(locationId)
    res.send(result)
})

router.post('/getPengirimanAgById', async (req, res) => {
    const pengirimanAgId = req.body.pengirimanAgId
    const result = await getPengirimanAgById(pengirimanAgId)
    res.send(result)
})

router.post('/getDetailPengirimanAgById', async (req, res) => {
    const pengirimanAgId = req.body.pengirimanAgId
    const result = await getDetailPengirimanAgById(pengirimanAgId)
    res.send(result)
})

router.post('/addPenerimaanAg', async (req, res) => {
    const result = await addPenerimaanAg(req.body)
    console.log(result)
    
    if(result.message === 'error'){
        res.send({"message": "error"})
    } else if(result.every(item => item > 0)) {
        res.send({"message": "ok"})
    } 
})

module.exports = router