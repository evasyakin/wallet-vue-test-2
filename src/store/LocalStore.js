/**
 * Local Storage.
 */
// import mock from './mock'

export default class LocalStore {
    local = window.localStorage
    getItem(key) {
        let val = this.local.getItem(key)
        try { return JSON.parse(val) } catch (e) { return val }
    }
    setItem(key, val) {
        this.local.setItem(key, 
            ['object','array'].includes(typeof val) ? JSON.stringify(val) : val
        )
    }
    reset() {
        this.local.clear() 
        console.log('Reset LocalStore')
    }
    get history() { return this.getItem('history') }
    get historyOffset() { return this.getItem('historyOffset') }
    get blocks() { return this.getItem('blocks') }

    saveHistory(hist) {
        this.setItem('history', hist.states)
        console.log('save history', hist)
        this.saveHistoryOffset(hist.offset)
    }
    saveHistoryOffset(offset) {
        this.setItem('historyOffset', offset)
        console.log('save history offset', offset)
    }
    saveBlock(block) {
        let blocks = this.blocks
        if (!blocks) this.setItem('blocks', [block])
        else {
            let index = blocks.findIndex(_block => _block.id == block.id)
            if (-1 === index) blocks.push(block)
            else blocks[index] = block
            this.saveBlocks(blocks)
        }
        console.log('Save block', block.id)
    }
    saveBlocks(blocks) {
        this.setItem('blocks', blocks)
    }

    // get history() {
    //     let hist = this.getItem('history') 
    //     console.log('GET LS history', hist)
    //     return hist
    // }
    // set history(hist) { 
    //     console.log('SET LS history', hist)
    //     this.setItem('history', hist)
    // }

    // get historyOffset() { 
    //     let offset = this.getItem('offset')
    //     console.log(`GET LS offset = ${offset}`)
    //     return offset
    // }
    // set historyOffset(offset) { 
    //     console.log(`SET LS offset = ${offset}`)
    //     this.setItem('offset', offset) 
    // }

    // get blocks() { return this.getItem('blocks') }
    // set blocks(blocks) { this.setItem('blocks', blocks) }
    // // blockById(id) { return this.blocks.find(block => block.id == id)}
    // // blockIndexById(id) { return this.blocks.findIndex(block => block.id == id)}

    // pushBlock(block) {
    //     if (!this.blocks) this.blocks = [block]
    //     else {
    //         let blocks = this.blocks
    //         let index = blocks.findIndex(_block => _block.id == block.id)
    //         if (-1 === index) blocks.push(block)
    //         else blocks[index] = block
    //         this.blocks = blocks
    //     }
    // }

    // pushHistory(ids) {
    //     if (!this.history) this.history = [[ids]]
    //     else this.history = this.history.concat([[ids]])
    // }

    // spliceHistory(offset = null) {
    //     if (null === offset) offset = this.historyOffset
    //     if (offset > 1) {
    //         let hist = this.history
    //         if (hist) hist.splice(hist.length - offset, offset)
    //         this.history = hist
    //     }
    // }
    
    // setHistoryOffset(offset) {
    //     this.historyOffset = offset
    // }

    // reset() {
    //     this.local.clear() 
    //     console.log('Reset LocalStore')
    // }
}
