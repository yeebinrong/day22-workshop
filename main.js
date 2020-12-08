// load libraries
const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql2/promise')
const cors = require('cors')
const bodyParser = require('body-parser')
const secureEnv = require('secure-env')

// create an instance of express
const app = express()

// declare port 
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// get env variables
global.env = secureEnv({secret: process.env.ENV_PASSWORD})

// create pool
const pool = mysql.createPool({
    host: global.env.SQL_HOST,
    port: global.env.SQL_PORT,
    user: global.env.SQL_USER,
    password: global.env.SQL_PASS,
    database: global.env.SQL_SCHEMA,
    connectionLimit: global.env.SQL_CON_LIMIT
})

// SQL Query
const SELECT_ORDER_BY_ID = 'SELECT orders.OrderID, orders.OrderDate, orders.CustomerID, details.UnitPrice, details.Discount, details.Quantity FROM orders LEFT JOIN `Order Details` as details on orders.OrderID = details.OrderID where orders.OrderID = ?'

const mkQuery = (sqlStmt, pool) => {
    return async (params) => {
        // get a connection from pool
        const conn = await pool.getConnection()
        try {
            // Execute the query with the parameter
            const results = await conn.query(sqlStmt, params)
            return results[0]
        } catch (e) {
            return Promise.reject(e)
        } finally {
            conn.release()
        }
    }
}

const SELECT_ORDER_BY_ID_QUERY = mkQuery(SELECT_ORDER_BY_ID, pool)

app.get('/order/total/:id', async (req, resp) => {
    const id = req.params.id
    const results = await SELECT_ORDER_BY_ID_QUERY(id);
    resp.type('application/json')
    resp.status(200)
    resp.json(results)
})

const startApp = async (app, pool) => {
    try {
        // get connection from db
        const conn = await pool.getConnection()
        console.info('Pinging database...')
        await conn.ping()

        // release connection
        conn.release()
        console.info('Ping Successful...')
        // listen for port
        app.listen(PORT, () => {
            console.info(`Application is listening PORT ${PORT} at ${new Date()}.`)
        })
    } catch (e) {
        console.error(`Error pinging database! ${e}.`)
    }
}

startApp(app, pool)