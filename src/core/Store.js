/**
 * My custon simple key-value store.
 */
import Vue from 'vue'

export default function (props) {
    let type = typeof props
    if (type !== 'object') {
        throw new Error(`Store constructor property must be an object, ${type} given`)
    }
    return Vue.observable(props)
}
