const { conn } = require("./dbUtils")

exports.getPeruntukanID = async (peruntukan = '') => {
    const dbConn = await conn()
    const sqlString = 'SELECT id, nama_unit FROM PERUNTUKAN WHERE nama_unit = ?'
    try {
        const [rows] = await dbConn.query(sqlString, [peruntukan.toUpperCase()])
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}

exports.editPeruntukan = async (barang) => {
    console.log('barang ', barang)
    if(barang.length == 0){
        return "parameter tidak lengkap"
    }
    const dbConn = await conn()
    const sqlString = 'INSERT INTO EDIT_PERUNTUKAN(BARANGID, KETERANGAN_ALASAN_DIGANTI, PERUNTUKANID, PERUNTUKAN_BARU) VALUES (?,?,?,?)'
    try {
        const [rows] = await dbConn.query(sqlString, [barang.ID, barang.alasan, barang.PERUNTUKANID, barang.peruntukanBaru])
        return rows
              
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}