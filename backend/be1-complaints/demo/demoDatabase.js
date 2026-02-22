const demoData = require('./demoData');

// Deep clone helper to reset data weeky
let currentData = JSON.parse(JSON.stringify(demoData));

// Helper to simulate MongoDB ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Collection Simulator
class DemoCollection {
    constructor(collectionName) {
        this.name = collectionName;
        // Map collection name to data key
        this.dataKey = collectionName === 'complaintsCollection' ? 'complaints' :
            collectionName === 'adminsCollection' ? 'admins' :
                collectionName === 'superAdminCollection' ? 'superAdmins' :
                    collectionName === 'assistantsCollection' ? 'assistants' :
                        'users'; // fallback
    }

    getData() {
        return currentData[this.dataKey] || [];
    }

    setData(newData) {
        currentData[this.dataKey] = newData;
    }

    // --- QUERY METHODS ---

    find(query = {}) {
        this.currentResult = this.getData().filter(item => this._matches(item, query));
        return this; // simulating chainable cursor
    }

    findOne(query = {}) {
        return Promise.resolve(this.getData().find(item => this._matches(item, query)) || null);
    }

    async insertOne(doc) {
        const newDoc = { _id: generateId(), ...doc };
        // Handle specific fields like timestamps if they are not objects
        if (this.name === 'complaintsCollection' && !newDoc.timestamp) {
            newDoc.timestamp = new Date();
        }
        this.getData().push(newDoc);
        return Promise.resolve({ acknowledged: true, insertedId: newDoc._id });
    }

    async updateOne(filter, update) {
        const data = this.getData();
        const index = data.findIndex(item => this._matches(item, filter));

        if (index === -1) return Promise.resolve({ matchedCount: 0, modifiedCount: 0 });

        const item = data[index];
        const updatedItem = this._applyUpdate(item, update);
        data[index] = updatedItem;

        return Promise.resolve({ matchedCount: 1, modifiedCount: 1 });
    }

    async deleteOne(filter) {
        const data = this.getData();
        const index = data.findIndex(item => this._matches(item, filter));

        if (index === -1) return Promise.resolve({ deletedCount: 0 });

        data.splice(index, 1);
        return Promise.resolve({ deletedCount: 1 });
    }

    async countDocuments(query = {}) {
        return Promise.resolve(this.getData().filter(item => this._matches(item, query)).length);
    }

    // --- CURSOR METHODS ---

    sort(sortOpts) {
        // Basic sort implementation (only handling simple cases)
        // sortOpts: { field: 1 (asc) or -1 (desc) }
        this.currentResult.sort((a, b) => {
            for (let key in sortOpts) {
                const order = sortOpts[key];
                // Handle nested keys like "flagged.flaggedAt"
                const valA = this._getNestedValue(a, key);
                const valB = this._getNestedValue(b, key);

                if (valA < valB) return -1 * order;
                if (valA > valB) return 1 * order;
            }
            return 0;
        });
        return this;
    }

    project(projection) {
        // Basic projection
        this.currentResult = this.currentResult.map(item => {
            const newItem = {};
            let excludeMode = false;
            for (let key in projection) {
                if (projection[key] === 0) {
                    excludeMode = true;
                    break;
                }
            }

            if (excludeMode) {
                Object.assign(newItem, item);
                for (let key in projection) {
                    if (projection[key] === 0) delete newItem[key];
                }
            } else {
                for (let key in projection) {
                    if (projection[key] === 1) newItem[key] = item[key];
                }
            }
            return newItem;
        });
        return this;
    }

    limit(n) {
        if (this.currentResult) {
            this.currentResult = this.currentResult.slice(0, n);
        }
        return this;
    }

    toArray() {
        return Promise.resolve(this.currentResult || []);
    }

    // --- INTERNAL UTILS ---

    _matches(item, query) {
        for (let key in query) {
            const condition = query[key];
            const itemVal = this._getNestedValue(item, key);

            // Handle MongoDB Operators
            if (condition && typeof condition === 'object') {
                if (condition.$in) {
                    if (!condition.$in.includes(itemVal)) return false;
                } else if (condition.$gte) {
                    if (!(new Date(itemVal) >= new Date(condition.$gte))) return false;
                } else if (condition.$lte) {
                    if (!(new Date(itemVal) <= new Date(condition.$lte))) return false;
                } else if (condition.$search) {
                    // Basic text search simulation
                    if (!JSON.stringify(item).toLowerCase().includes(condition.$search.toLowerCase())) return false;
                }
                // Add more operators as needed
            } else {
                // Direct match
                if (itemVal !== condition) return false;
            }
        }
        return true;
    }

    _applyUpdate(item, update) {
        // Very basic update implementation
        if (update.$set) {
            for (let key in update.$set) {
                this._setNestedValue(item, key, update.$set[key]);
            }
        }
        if (update.$push) {
            for (let key in update.$push) {
                const arr = this._getNestedValue(item, key) || [];
                arr.push(update.$push[key]);
                this._setNestedValue(item, key, arr);
            }
        }
        if (update.$inc) {
            for (let key in update.$inc) {
                const val = this._getNestedValue(item, key) || 0;
                this._setNestedValue(item, key, val + update.$inc[key]);
            }
        }
        if (update.$pull) {
            for (let key in update.$pull) {
                let arr = this._getNestedValue(item, key) || [];
                const filter = update.$pull[key];
                // Simple filter check (assumes filter is object with keys)
                arr = arr.filter(el => {
                    for (let fKey in filter) {
                        if (el[fKey] === filter[fKey]) return false; // remove if matches
                    }
                    return true;
                });
                this._setNestedValue(item, key, arr);
            }
        }
        // handle $unset if needed
        return item;
    }

    _getNestedValue(obj, path) {
        return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
    }

    _setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
}

const resetData = () => {
    currentData = JSON.parse(JSON.stringify(demoData));
    console.log("🔄 Demo Data Reset to Initial State");
};

// Singleton Mock DB Object
const demoDb = {
    collection: (name) => new DemoCollection(name),
    resetData
};

module.exports = demoDb;
