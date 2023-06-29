const { addBarang } = require("./barangDAO")
const { conn } = require("./dbUtils")
const { getPeruntukanID } = require("./peruntukanDAO")

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

exports.addStockReady = async (barang) =>{
    if(barang == undefined && barang.length == 0) {
        return "error: barang kosong"
    }
    const dbConn = await conn()
    try {
        for (const barangItem of barang){
            let peruntukanID = await getPeruntukanID(barangItem.peruntukan)
            barangItem.peruntukanID = peruntukanID[0].id
        }
        //   console.log("barang : ", barang)
        const barangIDList = await addBarang(barang)
        // console.log("list barang IDs : ", barangIDList)
        
        const barangIdLocationID = barangIDList.map(item => item)
        for(let i = 0; i < barangIdLocationID.length; i++){
            barangIdLocationID[i] = [barangIdLocationID[i], 2]
        }
        // console.log("barang + localtion IDs : ", barangIdLocationID)
        const sqlString = ('INSERT INTO create_stock_ready (barangID, lokasi_gudangID) VALUES ?')
        const values = [barangIdLocationID]
        const [rows] = await dbConn.query(sqlString, [barangIdLocationID])
        return rows
    } catch (error) {
        console.log(error)
        return "error"
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
        // console.log(rows)
        return rows;
    } catch (error) {
        console.log(error)
        return error
    } finally {
        await dbConn.end()
    }
    
}

exports.getDataPO = async (noPO) => {
    if(noPO === ''){
        return "no PO kosong"
    }
    const dbConn = await conn()
    const sqlString = 'SELECT jenis_barang, produk_seri, merk_barang, Qty_PO FROM CREATE_STOCK_PO WHERE no_PO = ?'
    try {
        const [rows] = await dbConn.execute(sqlString, [noPO])
        console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
        return error
    } finally {
        await dbConn.end()
    }
}