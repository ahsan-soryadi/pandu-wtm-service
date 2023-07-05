const express = require('express')
const { addPengirimanAg } = require('./pengirimanAgDAO')
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

module.exports = router