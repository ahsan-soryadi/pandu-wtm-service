const { conn } = require("./dbUtils")

exports.addStockPO = async ({noPO: noPO, jenisBarang: jenisBarang, produkSeri: produkSeri, merkBarang: merkBarang, qtyPO: qtyPO, usernameID: usernameID}) =>{
    // const {noPo, jenisBarang, produkSeri, merkBarang, qtyPo, usernameID} = createPoParams
    const dbConn = await conn()
    const sqlString = 'INSERT INTO CREATE_STOCK_PO (no_PO, jenis_barang, produk_seri, merk_barang, Qty_PO, usernameID) VALUES(?,?,?,?,?,?)'
    const values = [noPO, jenisBarang, produkSeri, merkBarang, qtyPO, usernameID]
    try {
        const [rows] = await dbConn.execute(sqlString, values)
        return rows
    } catch (error) {
        console.log(error)
        return error
    } finally {
        await dbConn.end()
    }
}

exports.checkNoPO = async (noPO) => {
    if(noPO === ''){
        return "no PO kosong"
    }
    const dbConn = await conn()
    const sqlString = 'SELECT no_PO FROM CREATE_STOCK_PO WHERE no_PO = ?'
    try {
        const [rows] = await dbConn.execute(sqlString, [noPO])
        console.log(rows)
        return rows;
    } catch (error) {
        console.log(error)
        return error
    } finally {
        await dbConn.end()
    }
    
}