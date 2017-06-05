import PouchDB from 'pouchdb'

const localDB = new PouchDB('mmt-ss2017')
const remoteDB = new PouchDB('https://couchdb.5k20.com/mmt-ss2017', {
    auth: {
        username: 'dscheffknecht',
        password: 'test',
    }
})

localDB
    .sync(remoteDB, {
        live: true,
        retry: true
    })
    .on('error', err => {
        console.error(`An error occured: ${err}`)
    })

export default class Store {
    /**
     * @param {!string} name Database name
     * @param {function()} [callback] Called when the Store is ready
     */
    constructor(name, callback) {

        /**
         * Read the local ItemList from localDB.
         *
         * @returns {ItemList} Current array of todos
         */
        this.getStore = () => {
            return new Promise(resolve => {
                localDB.allDocs({
                    include_docs: true,
                }).then(docs => {
                    const todos = docs.rows.map((row) => {
                        const doc = row.doc
                        return {
                            // the TODO-application itself relies on id instead of _id
                            id: doc._id,
                            title: doc.title,
                            completed: doc.completed,
                            _rev: doc._rev,
                        }
                    })
                    resolve(todos)
                }).catch(reason => {
                    console.error(`Failed to fetch all documents, reason: ${reason}`)
                })
            })
        }

        if (callback) {
            callback()
        }
    }

    /**
     * Find items with properties matching those on query.
     *
     * @param {ItemQuery} query Query to match
     * @param {function(ItemList)} callback Called when the query is done
     *
     * @example
     * db.find({completed: true}, data => {
	 *	 // data shall contain items whose completed properties are true
	 * })
     */
    find(query, callback) {
        this.getStore().then(todos => {
            // Original code from store.js:
            let k
            const filtered = todos.filter(todo => {
                for (k in query) {
                    if (query[k] !== todo[k]) {
                        return false
                    }
                }
                return true
            })
            callback(filtered)
        })
    }

    /**
     * Update an item in the Store.
     *
     * @param {ItemUpdate} update Record with an id and a property to update
     * @param {function()} [callback] Called when partialRecord is applied
     */
    update(update, callback) {
        this.getStore().then(todos => {
            let todoToUpdate = todos.find(todo => todo.id === update.id.toString())
            Object.assign(todoToUpdate, update)

            localDB.put({
                _id: todoToUpdate.id.toString(),
                title: todoToUpdate.title,
                completed: todoToUpdate.completed,
                _rev: todoToUpdate._rev
            }).then(callback())
        })
    }

    /**
     * Insert an item into the Store.
     *
     * @param {Item} item Item to insert
     * @param {function()} [callback] Called when item is inserted
     */
    insert(item, callback) {
        localDB.put({
            _id: item.id.toString(),
            title: item.title,
            completed: item.completed,
        }).then(() => callback())
    }

    /**
     * Remove items from the Store based on a query.
     *
     * @param {ItemQuery} query Query matching the items to remove
     * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
     */
    remove(query, callback) {
        this.getStore().then(todos => {
            let todosToKeep = []
            let todosToDelete = []

            todos.forEach(todo => {
                for (const k in query) {
                    // While query[k] is a number, todo[k] is a string. Let's cast.
                    if (query[k].toString() === todo[k]) {
                        todosToDelete.push(todo)
                        return
                    }
                }
                todosToKeep.push(todo)
            })

            // Let's not use the provided remove method from PouchDB.
            // Reason: https://pouchdb.com/api.html#filtered-replication
            todosToDelete = todosToDelete.map(todo => ({
                _id: todo.id,
                title: todo.title,
                completed: todo.completed,
                _rev: todo._rev,
                _deleted: true
            }))

            localDB
                .bulkDocs(todosToDelete)
                .then(() => callback(todosToKeep))
        })
    }

    /**
     * Count total, active, and completed todos.
     *
     * @param {function(number, number, number)} callback Called when the count is completed
     */
    count(callback) {
        this.getStore().then(todos => {
            const total = todos.length
            const completed = todos.reduce((completedCount, curTodo) => {
                if (curTodo.completed) {
                    ++completedCount
                }
                return completedCount
            }, 0)
            callback(total, total - completed, completed)
        })
    }
}
