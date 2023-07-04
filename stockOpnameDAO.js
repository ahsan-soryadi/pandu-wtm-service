const { conn } = require("./dbUtils")

exports.addStockOpname = async (barang = [], usernameId = '', tanggalSo = Date(), lokasiGudangId = 0) => {
    if(barang.length === 0){
        return "barang kosong"
    }
    
    // console.log("barang from addStockOpname = ",barang)
    const dbConn = await conn()
    const sqlString = 'INSERT INTO STOCK_OPNAME_BARU (usernameID, tanggal_so, lokasiGudangID) VALUES(?,?,?)'
    const sqlString2 = 'INSERT INTO STOCK_OPNAME_MATCH_STATUS (serialNumber, matchStatus, stockOpnameBaruID, jenisBarang) VALUES ?'
    try {
        const [insertResult] = await dbConn.query(sqlString, [usernameId, tanggalSo, lokasiGudangId])
        if(insertResult.insertId !== 0 ){
            let barangTemp = barang.map(item => [item.serialNumber, item.match, insertResult.insertId, item.jenisBarang])
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

exports.getAllStockOpname = async (lokasiGudangId = 0) =>{
    if(lokasiGudangId === 0){
        return "lokasi gudang kosong"
    }
    const dbConn = await conn()
    const sqlString = `SELECT id, 
                        (SELECT username FROM username WHERE username.id = stock_opname_baru.usernameID) 
                        AS createdBy, 
                        tanggal_so, 
                        (SELECT nama_gudang from lokasi_gudang WHERE lokasi_gudang.id = stock_opname_baru.lokasiGudangID)
                        AS lokasiGudang 
                        FROM stock_opname_baru WHERE lokasiGudangID = ?`
    try {
        const [rows] = await dbConn.query(sqlString, lokasiGudangId)
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.getAllStockOpnameDetails = async (stockOpnameId = 0) => {
    if(stockOpnameId === 0){
        return []
    }
    const dbConn = await conn()
    const sqlString = 'SELECT serialNumber, matchStatus, jenisBarang FROM STOCK_OPNAME_MATCH_STATUS WHERE stockOpnameBaruID = ?'
    try {
        const [rows] = await dbConn.query(sqlString, [stockOpnameId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}