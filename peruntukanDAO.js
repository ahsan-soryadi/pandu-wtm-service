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