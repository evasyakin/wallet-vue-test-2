/**
 * My custom plugin wrapper.
 */
function Plugin(name, ctx) {
    this.name = name
    this.install = function (Vue) {
        // console.log(`install plugin "${name}"`)
        Vue[name] = ctx
        Vue.prototype[name] = ctx
        Vue.prototype[`$${name}`] = ctx
        if (ctx.intall && typeof ctx.intall === 'function') {
            ctx.install()
        }
    }
}

export default Plugin;
