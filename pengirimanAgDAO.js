const { conn } = require("./dbUtils")

exports.addPengirimanAg = async (tagEntries = {}) =>{
    if(Object.keys(tagEntries).length === 0){
        return "entri pengiriman kosong"
    }
    const dbConn = await conn()
    const sqlString = `INSERT INTO pengiriman_ag 
                       (usernameID, 
                        lokasi_gudang_pengirimID, 
                        tgl_pengiriman, 
                        pilih_pengiriman, 
                        jasa_pengiriman,
                        no_resi, 
                        Qty, lokasi_gudang_penerimaID,
                        nomor_telepon) VALUES (?,?,?,?,?,?,?,?,?)`
    const sqlString2 = 'INSERT INTO pengiriman_ag_details (serialNumber, pengiriman_agID) VALUES ?'
    try {
        const [insertResult] = await dbConn.query(sqlString, [parseInt(tagEntries.usernameId), 
                                                            parseInt(tagEntries.lokasiGudangId),
                                                            tagEntries.tanggalPengiriman,
                                                            tagEntries.jenisPengiriman,
                                                            tagEntries.jasaPengiriman !== '' ? tagEntries.jasaPengiriman : null,
                                                            tagEntries.noResi,
                                                            parseInt(tagEntries.qty),
                                                            parseInt(tagEntries.gudangPenerima),
                                                            tagEntries.phoneNumber   
                                                        ])
        if(insertResult.insertId > 0){
            const values = tagEntries.serialNumber.map(item => item)
            for(let i = 0; i < values.length; i++){
                values[i] = [values[i], insertResult.insertId]
            }
            const [rows] = await dbConn.query(sqlString2, [values])
            return rows
        }
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.getAllPengirimanAg = async (locationId = 0) =>{
    if(locationId === 0){
        return []
    }
    const dbConn = await conn()
    const sqlString = `SELECT id, 
                        (SELECT username FROM username where username.id = pengiriman_ag.usernameID) as username,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_pengirimID) as gudangPengirim,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_penerimaID) as gudangPenerima,
                        tgl_pengiriman as tanggalPengiriman, 
                        pilih_pengiriman as jenisPengiriman,
                        jasa_pengiriman as jasaPengiriman,
                        Qty as qty,
                        no_resi FROM pengiriman_ag WHERE lokasi_gudang_pengirimID = ?`
    try {
        const [rows] = await dbConn.query(sqlString, [locationId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.getAllPenerimaanAg = async (locationId = 0) =>{
    if(locationId === 0){
        return []
    }
    const dbConn = await conn()
    const sqlString = `SELECT id, 
                        (SELECT username FROM username where username.id = pengiriman_ag.usernameID) as username,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_pengirimID) as gudangPengirim,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_penerimaID) as gudangPenerima,
                        tgl_pengiriman as tanggalPengiriman, 
                        pilih_pengiriman as jenisPengiriman,
                        jasa_pengiriman as jasaPengiriman,
                        no_resi, 
                        tanggal_penerimaan as tanggalPenerimaan 
                        FROM pengiriman_ag WHERE lokasi_gudang_penerimaID = ?`
    try {
        const [rows] = await dbConn.query(sqlString, [locationId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.getPengirimanAgById = async (pengirimanAgId = 0) => {
    if(pengirimanAgId === 0){
        return []
    }
    const dbConn = await conn()
    const sqlString = `SELECT id, 
                        (SELECT username FROM username where username.id = pengiriman_ag.usernameID) as username,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_pengirimID) as gudangPengirim,
                        (SELECT nama_gudang FROM lokasi_gudang WHERE lokasi_gudang.id = pengiriman_ag.lokasi_gudang_penerimaID) as gudangPenerima,
                        tgl_pengiriman as tanggalPengiriman, 
                        pilih_pengiriman as jenisPengiriman,
                        jasa_pengiriman as jasaPengiriman,
                        no_resi, Qty, nomor_telepon FROM pengiriman_ag WHERE id = ?`
    try {
        const [rows] = await dbConn.query(sqlString, [pengirimanAgId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.getDetailPengirimanAgById = async (pengirimanAgId = 0) => {
    if(pengirimanAgId === 0){
        return []
    }
    const dbConn = await conn()
    const sqlString = `SELECT serialNumber, 
                        (SELECT produk_seri FROM barang WHERE barang.serialNumber = pengiriman_ag_details.serialNumber) AS produkSeri,
                        (SELECT jenis_barang FROM barang WHERE barang.serialNumber = pengiriman_ag_details.serialNumber) AS jenisBarang,
                        tanggal_penerimaan as tanggalDiterima FROM pengiriman_ag_details WHERE pengiriman_agID = ?`
    try {
        const [rows] = await dbConn.query(sqlString, [pengirimanAgId])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.addPenerimaanAg = async (tagEntries = {}) => {
    console.log(tagEntries)
    if(Object.keys(tagEntries).length === 0){
        return {"message": "error"}
    }

    const dbConn = await conn()
    const sqlString = 'UPDATE pengiriman_ag SET tanggal_penerimaan = ? WHERE id = ?'
    const sqlString2 = 'UPDATE pengiriman_ag_details SET tanggal_penerimaan = ? WHERE pengiriman_agID = ?'
    const sqlString3 = 'UPDATE barang SET lokasi_gudangID = (SELECT id FROM lokasi_gudang WHERE nama_gudang = ?) WHERE serialNumber = ?'
    let resultUpdate = []
    try {
        const [insertResult] = await dbConn.query(sqlString, [tagEntries.tanggalPenerimaan, tagEntries.pengirimanAgId])
        // console.log("insert result = ", insertResult)
        if(insertResult.affectedRows > 0){
            const [rows] = await dbConn.query(sqlString2, [tagEntries.tanggalPenerimaan, tagEntries.pengirimanAgId])
            // console.log("rows = ", rows)
            if(rows.affectedRows > 0){
                
                for(let i = 0; i <rows.affectedRows; i++){
                    const [updateBarangLocation] = await dbConn.query(sqlString3, [tagEntries.gudangPenerima, tagEntries.serialNumber[i]])
                    // console.log(updateBarangLocation)
                    resultUpdate.push(updateBarangLocation.affectedRows)
                }
                return resultUpdate
            }
        } else {
            return {"message": "error"}
        }
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}
    