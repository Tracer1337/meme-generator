const Collection = require("./Collection.js")
const { queryAsync } = require("../app/utils")

const requiredProps = ["table", "columns"]

/**
 * Class representing a Model. Strictly bound to the database.
 * 
 * @attribute {String} table - The name of the table bound to the model
 * @attribute {String[]} columns - The column names of the table in the correct order
 */
class Model {
    /**
     * Select all matches for the given SQL selector and return a
     * collection containing models for all rows in the query result
     */
    static async where(selector) {
        // Get matches from database
        const query = `SELECT * FROM ${this.table} WHERE ${selector}`
        const results = await queryAsync(query)

        // Create models from results
        const models = await Promise.all(results.map(async row => {
            const model = new this.model(row)

            if(model.init) {
                await model.init()
            }

            return model
        }))

        return new Collection(models)
    }

    /**
     * Create a model from the first match for 'column = value'
     */
    static async findBy(column, value) {
        return (await Model.where.call(this, `${column} = '${value}'`))[0]
    }

    /**
     * Create a collection from all matches for 'column = value'
     */
    static async findAllBy(column, value) {
        return await Model.where.call(this, `${column} = '${value}'`)
    }

    /**
     * Create a collection from all entries
     */
    static async getAll() {
        return await Model.where.call(this, "1")
    }

    /**
     * Store the model into the database
     */
    async store() {
        const query = `INSERT INTO ${this.table} SET ?`
        await queryAsync(query, this.getColumns())
    }

    /**
     * Update the model in the database
     */
    async update() {
        const query = `UPDATE ${this.table} SET ? WHERE id = ${this.id}`
        await queryAsync(query, this.getColumns())
    }

    /**
     * Delete the model from the database
     */
    async delete() {
        const query = `DELETE FROM ${this.table} WHERE id = '${this.id}'`
        await queryAsync(query)
    }

    /**
     * Create a new instance of the model and pass all attributes of this
     */
    clone() {
        return new this.constructor(this)
    }

    /**
     * Create a column map (column_name: value)
     */
    getColumns() {
        const values = {}
        this.columns.forEach(column => this[column] && (values[column] = this[column]))
        return values
    }
    
    /**
     * Create a model
     */
    constructor(props) {
        // Check if the required attributes are defined
        requiredProps.forEach(attribute => {
            if (!props[attribute]) {
                throw new Error(`The attribute "${attribute}" is missing in model "${this.constructor.name}"`)
            }
        })

        // Assign props to this
        for(let key in props) {
            this[key] = props[key]
        }
    }
}

module.exports = Model