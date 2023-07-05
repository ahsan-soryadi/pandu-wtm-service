const { conn } = require("./dbUtils")

exports.getAllGudang = async () => {
    const dbConn = await conn()
    const sqlString = 'SELECT id, nama_gudang as namaGudang FROM LOKASI_GUDANG'
    try {
        const [rows] = await dbConn.query(sqlString)
        return rows
    } catch (error) {
        console.log(error)
    } finally {
        await dbConn.end()
    }
}