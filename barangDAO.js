const { conn } = require("./dbUtils")

//add localtion ID
exports.addBarang = async (barang) => {
    // console.log("barangnya : ", barang)
    if(barang == undefined && barang.length == 0){
        return "Barang Kosong"
    }
    const barangTmp = barang.map(barangItem => [barangItem.produkSeri, barangItem.jenisBarang, barangItem.merkBarang, barangItem.serialNumber, barangItem.peruntukanID, 2])
    // console.log("barang tmp = ", barangTmp)
    const sqlString = 'INSERT INTO BARANG (produk_seri, jenis_barang, merk_barang, serialNumber, peruntukanID, lokasi_gudangID) VALUES ?'
    const dbConn = await conn()
    try {
        const [rows] = await dbConn.query(sqlString, [barangTmp])
        let insertedId = []
        if(rows.affectedRows > 0){
            for(let i = 0; i < rows.affectedRows; i++){
                insertedId.push(rows.insertId + i)
            }
            // console.log("barang IDs : ", insertedId)
            return insertedId
        }
    } catch (error) {
        console.log(error)
        return "error"
    } finally {
        await dbConn.end()
    }   
}

exports.checkSerialNumber = async (serialNumber = []) => {
    // const dbConn = await conn()
    if(serialNumber.length == 0){
        console.log("serial number kosong")
    }
    const dbConn = await conn()
    const checkResult = []
    try {
        for(let i = 0; i < serialNumber.length; i++){
            const sqlString = ' SELECT serialNumber from BARANG WHERE serialNumber = ?'
            const [rows] = await dbConn.query(sqlString, [serialNumber[i]])
            if(rows.length > 0){
                checkResult.push("true")
            } else {
                checkResult.push("false")
            }
        }
        console.log(checkResult)
        return checkResult
    } catch (error) {
        console.log("error")
        return "error"
    } finally {
        await dbConn.end()
    }
}