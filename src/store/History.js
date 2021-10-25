export default class History {
    states = [] // шаги истории
    offset = 0 // курсор истории
    desktop = null // привязанный стол

    constructor(desktop) {
        this.desktop = desktop
    }

    get localStore() { return this.desktop.localStore }

    // получение количества шагов
    size() { return this.states.length }

    //
    hasUndo() { return this.undoCount() > 0 }
    hasRedo() { return this.redoCount() > 0 }

    undoCount() { return this.size() - 1 - this.offset }
    redoCount() { return this.offset }

    // шаг назад по истории
    undo() {
        if (this.hasUndo()) {
            this.renderCurrent(block => { block.historyUndo() })
            this.offset++
            this.localStore.saveHistoryOffset(this.offset)
        }
    }
    // шаг вперёд по истории
    redo() {
        if (this.hasRedo()) {
            this.offset--
            this.renderCurrent(block => { block.historyRedo() })
            this.localStore.saveHistoryOffset(this.offset)
        }
    }

    // переход к конкретному шагу истории
    moveTo(offset) {
        if (this.offset < offset) {
            let tries = 0;
            while (this.offset < offset && tries++ < 10) {
                this.undo()
                console.log(`Делаем undo ${tries}`, this.offset, offset)
            }
        }
    }

    // рендер текущего шага истории
    renderCurrent(cb) {
        let ids = this.states[this.size() - 1 - this.offset]
        if (!ids) throw new Error(`Ids state for offset ${this.offset} not found`)
        if (!Array.isArray(ids)) ids = []
        ids.forEach(id => {
            let block = this.desktop.blockById(id)
            if (!block) throw new Error(`Block with id="${id} not found`)
            cb(block)
        })
    }    

    // добавление шага истории
    add(ids) {
        this.remove()
        this.states.push(ids)
        this.offset = 0
        this.localStore.saveHistory(this)
    }

    // удаление шагов истории позже текущего
    remove() {
        if (this.hasRedo()) {
            this.states.splice(this.size() - 1 - this.offset, this.offset)
        }
    }

    // инициализирующий пуш состояний блоков стола
    initial() {
        let ids = []
        this.desktop.each(block => {
            ids.push(block.id)
            block.historyPushState(false)
        })
        this.add(ids)
    }

    // очистка истории
    reset() {
        this.states = []
        this.offset = 0
    }

    // восстановление истории блоков
    restore() {
        this.states = this.localStore.history
        this.offset = 0
        this.moveTo(this.localStore.historyOffset) // переходим к шагу истории
    }
}
