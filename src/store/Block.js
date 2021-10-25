// import { Model } from 'vue-mc'
import Desktop from './Desktop'
import Model from '../core/Model'

export default class Block extends Model {
    defaults() {
        return Object.assign(super.defaults(), {
            id: null,
            title: 'Undefined title',
            content: 'Undefined content',
            posX: 0, posY: 0, posZ: 0,
            sizeX: 300, sizeY: 100,
            intersecting: false,
            action: null,
            states: [],
        })
    }
    cursorOffset =  {x: 0, y: 0}
    lastAction = null
    blockUp = false

    // получение координат начала и конца блока
    get start() { return {x: this.posX, y: this.posY} }
    get end() { return {x: this.posX + this.sizeX, y: this.posY + this.sizeY} }

    // хук сохранения стола блока при регистрации коллекции
    registerCollection(collection) {
        super.registerCollection(collection)
        if (collection instanceof Desktop) this.desktop = collection
    }

    // удаление блока в корзину или полное удаление
    remove(saveHistory = true) {
        if ('bin' === this.action) {
            // полное удаление, если блок уже в корзине
            this.desktop.bin.remove(this)
        } else {
            // удаление в корзину
            this.rollbackAction()
            this.desktop.bin.add(this)
            this.desktop.remove(this)
            this.action = 'bin'
            if (saveHistory) this.historyPushState()
        }
    }

    // восстановление блока из корзины
    restore(saveHistory = true) {
        this.desktop.add(this)
        this.desktop.bin.remove(this)
        this.rollbackAction()
        this.action = null
        this.blockUp = false
        this.desktop.intersectCheck(this) // проверяем пересечения
        if (saveHistory) this.historyPushState()
    }

    // поднятие блока поверх других
    up() {
        this.desktop.sort('posZ')
        this.desktop.each((block, index) => {
            block.posZ = index
            block.blockUp = false
        })
        this.blockUp = true
        this.posZ = this.desktop.size()
        this.desktop.bin.close()
    }

    // установка сдвига курсора от элемента нажатия
    setCursorOffset (e) {
        let [x, y] = this.getNodeFullOffset(e.target)
        x = e.pageX - x
        y = e.pageY - y
        this.cursorOffset = {x, y}
    }
    getNodeFullOffset (node) {
        let x = 0, y = 0
        while (node) {
            x += node.offsetLeft
            y += node.offsetTop
            node = node.offsetParent
        }
        return [x, y]
    }

    // начало движения или ресайза блока
    actionStart(action, e) {
        if (['move','resize'].includes(action)) {
            this.up()
            console.log(`${action} start`)
            this.setCursorOffset(e)
            this.makeAction()
            this.action = action
        }
    }

    // движение или ресайз блока
    actionProcess(e) {
        if ('move' == this.action) {
            this.posX = e.pageX - this.desktop.offset.x - this.cursorOffset.x
            this.posY = e.pageY - this.desktop.offset.y - this.cursorOffset.y
            this.desktop.intersectCheck(this) // проверяем пересечения
        }
        if ('resize' == this.action) {
            this.sizeX = e.pageX - this.posX - this.desktop.offset.x + this.cursorOffset.x
            this.sizeY = e.pageY - this.posY - this.desktop.offset.y + this.cursorOffset.y
            this.desktop.intersectCheck(this) // проверяем пересечения
        }
    }

    // завершение движения или ресайза блока
    actionEnd() {
        if (['move','resize'].includes(this.action)) {
            console.log(`${this.action} end`)
            this.desktop.intersectEndCheck(this) // // проверяем пересечения
            this.commitAction()
            this.support()
        }
    }


    // создать действие
    makeAction() {
        this.lastAction = {
            posX: this.posX, posY: this.posY,
            sizeX: this.sizeX, sizeY: this.sizeY,
        }
    }

    // закомитить действие (успешно завершить)
    commitAction() {
        this.lastAction = null
        this.action = null
        this.historyPushState()
    }

    // отменить последнее действие
    rollbackAction() {
        if (this.lastAction) {
            for (let key in this.lastAction) {
                this[key] = this.lastAction[key]
            }
        }
        this.action = null
    }

    
    
    // HISTORY

    offset = 0

    // получение атрибутов блока
    attributes() { return this._attributes }
    // получение состояния блока
    getState() { return Object.assign({}, this.attributes()) }

    // добавить состояние в историю
    historyPushState(glob = true) {
        let state = this.getState()
        delete state.states
        if (this.offset > 0) {
            this.states.splice(this.states.length - this.offset, this.offset)
        }
        this.states.push(state)
        if (glob) this.desktop.history.add([this.id])
        this.offset = 0
        let bin = state.action == 'bin' ? 'bin' : 'desk'
        console.log(`PUSH STATE (${state.posX}, ${state.posY}) ${bin}`, 
            `count=${this.states.length}, offset=${this.offset}`)
        // this.updateLocalBlock()
        // return this.getState()
        this.desktop.localStore.saveBlock(this)
    }

    // updateLocalBlock () {
    //     let block = this.getState()
    //     // block.states = this.states
    //     let blocks = window.localStorage.getItem('blocks')
    //     console.log('GET FROM STORAGE', blocks, `for id="${this.id}"`)
    //     if (!blocks) blocks = [block]
    //     else {
    //         blocks = JSON.parse(blocks)
    //         let index = blocks.findIndex(_block => _block.id == this.id)
    //         if (-1 === index) blocks.push(block)
    //         else blocks[index] = block
    //     }
    //     console.log('ADD TO STORAGE', blocks)
    //     // console.log('ADD TO STORAGE', JSON.stringify(blocks))
    //     window.localStorage.setItem('blocks', JSON.stringify(blocks))
    // }

    historyUndo() {
        if (this.offset <= this.states.length) {
            this.offset++
            this.historyStateRender()
        }
    }

    historyRedo() {
        if (this.offset > 0) {
            this.offset--
            this.historyStateRender()
        }
    }

    // historyCurrent() {
    //     this.historyStateRender(offset)
    // }

    // получение состояния шага истории
    getHistoryState(offset = null) {
        if (null === offset) offset = this.offset
        let state = this.states[this.states.length - 1 - offset]
        if (!state) throw new Error(`Not found history state for block with id="${this.id}`)
        return state
    }

    // применить шаг истории
    historyStateRender() {
        let state = this.getHistoryState()
        let fromBin = this.action == 'bin' ? 'bin' : 'desk'
        let toBin = state.action == 'bin' ? 'bin' : 'desk'
        console.log(`render state (${this.posX}, ${this.posY}) ${fromBin} => (${state.posX}, ${state.posY}) ${toBin}`)
        this.posX = state.posX
        this.posY = state.posY
        this.sizeX = state.sizeX
        this.sizeY = state.sizeY
        this.up()
        if (this.action === 'bin' && state.action !== 'bin') {
            this.restore(false)
        } else if (this.action !== 'bin' && state.action === 'bin') {
            this.remove(false)
        }
    }

    historyReset() {
        this.states = []
        this.offset = 0
    }
}
