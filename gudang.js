const express = require('express')
const { getAllGudang } = require('./gudangDAO')
const router = express.Router()

router.get('/getAllGudang', async (req, res) => {
    const result = await getAllGudang()
    res.send(result)
})

module.exports = router