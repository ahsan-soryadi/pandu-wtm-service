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

exports.checkSerialNumber = async (serialNumber = [], locationId = 0, jenisBarang = '') => {
    // const dbConn = await conn()
    if(serialNumber.length == 0){
        return []
    }
    const dbConn = await conn()
    const checkResult = []
    let sqlString = ' SELECT serialNumber from BARANG WHERE serialNumber = ?'
    if (locationId !== 0) {
        sqlString += ' AND lokasi_gudangID = ?'
    }
    if (jenisBarang !== ''){
        sqlString += ' AND jenis_barang = ?'
    }
    try {
        // console.log(typeof serialNumber)
        if(typeof serialNumber === 'object'){
            for(let i = 0; i < serialNumber.length; i++){
                const [rows] = await dbConn.query(sqlString, [serialNumber[i], locationId, jenisBarang])
                if(rows.length > 0){
                    // console.log(rows)
                    checkResult.push("true")
                } else {
                    checkResult.push("false")
                }
            }
        } else {
            // console.log(sqlString)
            // const sqlString = ' SELECT serialNumber from BARANG WHERE serialNumber = ?'
                const [rows] = await dbConn.query(sqlString, [serialNumber, locationId, jenisBarang])
                // console.log(rows)
                if(rows.length > 0){
                    checkResult.push("true")
                } else {
                    checkResult.push("false")
                }
        }
        return checkResult
    } catch (error) {
        console.log(error)
        return "error"
    } finally {
        await dbConn.end()
    }
}

exports.getAllBarang = async () => {
     const dbConn = await conn()
     const sqlString = 'SELECT ID, JENIS_BARANG, PRODUK_SERI, MERK_BARANG  FROM BARANG WHERE SERIALNUMBER IS NOT NULL'
     const [rows] = await dbConn.query(sqlString)
     if(rows.length > 0 ){
        return rows
     } else {
        return "error"
     }
}

exports.getAllBarangCatalogue = async ({locationId = 0}) => {
    const dbConn = await conn()
    const andLocation = ` and lokasi_gudangID = ? `
    const groupBy = `group by jenis_barang`
    const sqlString = `SELECT jenis_barang,
    merk_barang, 
    produk_seri, 
    count(*) as qty 
    from barang 
    where serialNumber is not null `
    let finalSqlString = ''
    if(locationId == 0 ){
        finalSqlString = sqlString + groupBy
    } else {
        finalSqlString = sqlString + andLocation + groupBy
    }
    try {
        const [rows] = await dbConn.query(finalSqlString, [locationId])
        return rows
    } catch (error) {
        console.log(error)        
    } finally {
        await dbConn.end()
    }
}

exports.getAllBarangByLocation = async ({locationId = 0}) => {
    if(locationId === 0) return "lokasi kosong"
    const dbConn = await conn()
    const sqlString = `SELECT ID as id, 
                       PRODUK_SERI AS produkSeri, 
                       JENIS_BARANG AS jenisBarang, 
                       MERK_BARANG AS merkBarang, 
                       serialNumber, 
                       (SELECT NAMA_UNIT FROM PERUNTUKAN WHERE PERUNTUKAN.ID = BARANG.PERUNTUKANID) 
                       AS peruntukan FROM BARANG WHERE LOKASI_GUDANGID = ?`
    try {
        const [rows] = await dbConn.query(sqlString, [locationId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}


exports.getBarangBySerialNumber = async ({serialNumber = ''}) => {
    if(serialNumber === ''){
        return {}
    }
    const dbConn = await conn()
    try {
        const sqlString = `SELECT ID, serialNumber, jenis_barang, merk_barang, 
                    (select nama_unit 
                        from peruntukan 
                        where peruntukan.id = barang.peruntukanID) as peruntukan
                    from barang where serialNumber = ?`
        const [rows] = await dbConn.query(sqlString, [serialNumber])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
    
}

exports.editPeruntukanBarang = async ({serialNumber = '', peruntukan = ''}) => {
    const dbConn = await conn()
    const sqlString = 'UPDATE BARANG SET PERUNTUKANID = (SELECT ID FROM PERUNTUKAN WHERE NAMA_UNIT = ?) WHERE SERIALNUMBER = ?'
    const sqlStringSelect = 'SELECT ID, PERUNTUKANID FROM BARANG WHERE SERIALNUMBER = ?'
    try {
        const [rows] = await dbConn.query(sqlString, [peruntukan.toUpperCase(), serialNumber])
        if(rows.affectedRows > 0){
            // console.log(rows)
            const [selectRows] = await dbConn.query(sqlStringSelect, [serialNumber])
            if(selectRows.length > 0){
                return selectRows
            } else {
                return "barang tidak ditemukan"
            }
            
        } else {
            return "error"
        }
    } catch (error) {
        console.log(error)
        return 'error'
    } finally {
        await dbConn.end()
    }
}