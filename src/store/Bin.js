import { Collection } from 'vue-mc'
import Block from './Block'

export default class Bin extends Collection {
    model() {
        return Block
    }
    desktop = null; opened = false
    posX = 0; posY = 0; sizeX = 0; sizeY = 0

    // установка стола корзины
    setDesktop(desktop) {
        this.desktop = desktop
        return this
    }
    // установка координат корзины из её узла
    setCoords(elem) {
        this.posX = elem.offsetLeft
        this.posY = elem.offsetTop
        this.sizeX = elem.offsetWidth
        this.sizeY = elem.offsetHeight
    }

    // открытие, закрытие и тоггл открытия
    open() { 
        this.opened = true 
        this.desktop.each(block => block.blockUp = false)
    }
    close() { this.opened = false }
    openingToggle() { this.opened ? this.close() : this.open() }

    // получение координат начала и конца корзины
    get start() { return {x: this.posX, y: this.posY} }
    get end() { return {x: this.posX + this.sizeX, y: this.posY + this.sizeY} }

    // восстановление всех блоков
    restoreAll() {
        if (this.size() < 1) return
        let state = []
        for (let i = this.size() - 1; i >= 0; i--) {
            let block = this.models[i]
            block.restore(false)
            block.historyPushState(false)
            state.push(block.id)
        }
        this.desktop.history.add(state)
    }
}
