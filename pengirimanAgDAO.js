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
                                                            tagEntries.jasEkspedisi !== '' ? tagEntries.jasEkspedisi : null,
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