const { conn } = require("./dbUtils")

exports.addStockOpname = async (barang = [], usernameId = '', tanggalSo = Date(), lokasiGudangId = 0) => {
    if(barang.length === 0){
        return "barang kosong"
    }
    
    console.log("barang from addStockOpname = ",barang)
    const dbConn = await conn()
    const sqlString = 'INSERT INTO STOCK_OPNAME_BARU (usernameID, tanggal_so, lokasiGudangID) VALUES(?,?,?)'
    const sqlString2 = 'INSERT INTO STOCK_OPNAME_MATCH_STATUS (serialNumber, matchStatus, stockOpnameBaruID) VALUES ?'
    try {
        const [insertResult] = await dbConn.query(sqlString, [usernameId, tanggalSo, lokasiGudangId])
        if(insertResult.insertId !== 0 ){
            let barangTemp = barang.map(item => [item.serialNumber, item.match, insertResult.insertId])
           const [rows] = await dbConn.query(sqlString2, [barangTemp]) 
                return rows
        } else {
            return "insert error"
        }
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
   
}