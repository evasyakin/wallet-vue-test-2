import { Collection } from 'vue-mc'
import Block from './Block'
import Bin from './Bin'
import History from './History'
import LocalStore from './LocalStore'
import mock from './mock'

export default class Desktop extends Collection {
    model() {
        return Block
    }

    id = 1; _elem = null
    offset = {x: 0, y: 0}
    sizeX = 0; sizeY = 0
    between = 10; halfBetween = 5 //Math.floor(this.between / 2)
    bin = (new Bin).setDesktop(this)
    localStore = new LocalStore
    history = new History(this)

    // установка узла стола
    set elem(elem) {
        // console.log(elem)
        this._elem = elem
        this.offset.x = elem.offsetLeft
        this.offset.y = elem.offsetTop
        this._elem.style.minHeight = `calc(100vh - ${this.offset.y}px)`
        this.calcCoords()
    }

    // получение усзла стола
    get elem() { return this._elem }

    // вычисление размеров стола
    calcCoords() {
        this.sizeX = this.elem.offsetWidth
        this.sizeY = this.elem.offsetHeight
        if (this.oldSizeX && this.oldSizeY) {
            this.intersectCheckAll()
        }
        this.oldSizeX = this.sizeX
        this.oldSizeY = this.sizeY
        // console.log(this.sizeX, this.sizeY)
    }

    // поиск блока по id на столе или в корзине
    blockById(id) {
        let model = this.models.find(model => model.id == id)
        if (!model) model = this.bin.models.find(model => model.id == id)
        return model
    }

    // проверка пересечения двух блоков
    intersect(b1, b2) {
        let left = b2.start.x - b1.end.x - this.halfBetween
        let top = b2.start.y - b1.end.y - this.halfBetween
        let right = b2.end.x - b1.start.x + this.halfBetween
        let bottom = b2.end.y - b1.start.y + this.halfBetween
        let intersect = left < 0 && top < 0 && right > 0 && bottom > 0
        // intersect = 
        // (b1.end.x > b2.start.x - this.halfBetween)
        // && (b1.end.y > b2.start.y - this.halfBetween)
        // && (b1.start.x < b2.end.x + this.halfBetween)
        // && (b1.start.y < b2.end.y + this.halfBetween)
        return [intersect, left, top, right, bottom]
    }

    // остановка пересечения блока
    stopIntersecting(b1, b2) {
        let [intersect, left, top, right, bottom] = this.intersect(b1, b2)
        if (intersect) {
            let side, isLeft = left + right, isTop = top + bottom
            let sideH = isLeft > 0 ? 'left' : (isLeft < 0 ? 'right' : '')
            let sideV = isTop > 0 ? 'top': (isTop < 0 ? 'bottom' : '')
            side = `${sideH}-${sideV}`
            isLeft = isLeft > 0
            isTop = isTop > 0

            let boxLeft = b1.posX < this.between
            let boxTop = b2.posY + this.between < b1.sizeY
            let boxBottom = this.sizeY - b2.end.y < b1.sizeY + this.between
            // let boxRight = this.sizeX - b2.end.x < b1.sizeX + this.between * 2
            let upd = {
                x: (isLeft && !boxLeft) ? left - this.halfBetween : right + this.halfBetween,
                y: (isTop && !boxTop) ? top - this.halfBetween : bottom + this.halfBetween,
            }
            if (boxBottom) upd.y = top - this.halfBetween
            // if (boxRight) upd.x = left - this.halfBetween

            console.log(`intersect: ${side}, b1: ${b1.id}, b2: ${b2.id}`, b1.action)
            console.log(`b1: ${b1.id}, posX: ${b1.posX}, sizeX: ${b1.sizeX}`)
            console.log(`b2: ${b2.id}, posX: ${b2.posX}, sizeX: ${b2.sizeX}`)

            /**
             * Чтобы нормально написать код ниже требуется дополнительное время.
             * В рамках тестового задания не буду это делать.
             * Уже итак много всего сделано для бесплатного тестового.
             */
            let dir = Math.abs(upd.x) - Math.abs(upd.y)
            if (['move', null].includes(b1.action)) {
                if (dir <= 0) {
                    let before = b1.posX
                    b1.posX += upd.x
                    console.log('MOVE x', before, b1.posX)
                }
                else if (dir > 0) {
                    let before = b1.posY
                    b1.posY += upd.y
                    console.log('MOVE y', before, b1.posY)
                }
            } else if (['resize'].includes(b1.action)) {
                let sizedX = false
                if (b1.end.x >= this.sizeX - this.between * 2) {
                    b1.posX = b2.end.x + this.between
                    b1.sizeX = this.sizeX - b1.posX - this.between
                    console.log('RIGHT!')
                    // b1.actionEnd()
                    sizedX = true
                } 
                if (b1.posX <= this.between) {
                    b1.posX = this.between
                    b1.sizeX = b2.posX - this.between * 2
                    console.log('LEFT!', b1.start.x, b2.start.x)
                    // b1.actionEnd()
                    sizedX = true
                }
                if (!sizedX && dir < 0) {
                    let before = b1.sizeX
                    b1.sizeX += upd.x
                    console.log('RESIZE x', before, b1.sizeX)
                }

                let sizedY = false
                if (b1.end.y >= this.sizeY - this.between * 2) {
                    b1.posY = b2.end.y + this.between
                    b1.sizeY = this.sizeY - b1.posY - this.between
                    console.log('BOTTOM!')
                    // b1.actionEnd()
                    sizedY = true
                } 
                if (b1.posY <= this.between) {
                    b1.posY = this.between
                    b1.sizeY = b2.posY - this.between * 2
                    console.log('TOP!')
                    // b1.actionEnd()
                    sizedY = true
                }
                
                if (!sizedY && dir > 0) {
                    let before = b1.sizeY
                    b1.sizeY += upd.y
                    console.log('RESIZE y', before, b1.sizeY)
                }
                
                // if (!sized) b1.rollbackAction()
                // b1.action = null
                // b1.actionEnd()
            }
        }
    }

    // stopDesktopResizeIntersecting(b1, b2) {
    //     let between_x2 = this.between * 2
    //     let x = true, y = true
    //     if (b1.end.x >= this.sizeX - between_x2) {
    //         b1.posX = b2.end.x + this.between
    //         b1.sizeX = this.sizeX - b1.posX - this.between
    //         console.log('RIGHT!')
    //     } else if (b1.posX <= this.between) {
    //         b1.posX = this.between
    //         b1.sizeX = b2.posX - between_x2
    //         console.log('LEFT!')
    //     } else x = false

    //     if (b1.end.y >= this.sizeY - between_x2) {
    //         b1.posY = b2.end.y + this.between
    //         b1.sizeY = this.sizeY - b1.posY - this.between
    //         console.log('BOTTOM!')
    //     } else if (b1.posY <= this.between) {
    //         b1.posY = this.between
    //         b1.sizeY = b2.posY - between_x2
    //         console.log('TOP!')
    //     } else y = false
    //     return [x, y]
    // }

    // проверка перечечений блока
    intersectCheck(b1) {
        this.keepOnDesktop(b1)
        if (this.removeIfIntersectBin(b1)) return
        this.each(b2 => {
            if (b1.id == b2.id || b1.intersecting && b2.intersecting) return
            this.stopIntersecting(b1, b2)
        })
    }

    // проверка пересечений блоков
    intersectCheckAll() {
        this.each(b1 => {
            this.keepOnDesktop(b1)
            if (this.removeIfIntersectBin(b1)) return
            this.each(b2 => {
                if (b1.id == b2.id || b1.intersecting && b2.intersecting) return
                this.stopIntersecting(b1, b2)
            })
        })
    }

    // проверка пересений блока при завершении движений или ресайза
    intersectEndCheck(b1) {
        this.keepOnDesktop(b1)
        if (this.removeIfIntersectBin(b1)) return
        for (let b2 of this.models) {
            if (b1.id == b2.id || b1.intersecting && b2.intersecting) continue
            if (this.intersect(b1, b2)[0]) b1.rollbackAction()
        }
    }

    // оставляем блок на столе
    keepOnDesktop(b1) { 
        // проверяем размеры
        let between_x2 = this.between * 2
        if (b1.sizeX + between_x2 > this.sizeX) b1.sizeX = this.sizeX - between_x2
        if (b1.sizeY + between_x2 > this.sizeY) b1.sizeY = this.sizeY - between_x2
        // проверяем позицию
        if (b1.start.x < 0) b1.posX = this.between
        if (b1.start.y < 0) b1.posY = this.between
        if (b1.end.x > this.sizeX) b1.posX = this.sizeX - b1.sizeX - this.between
        if (b1.end.y > this.sizeY) b1.posY = this.sizeY - b1.sizeY - this.between
    }

    // удаляем блок в корзину, если он соприкоснулся с корзиной
    removeIfIntersectBin(b1) {
        let [intersect] = this.intersect(b1, this.bin)
        if (intersect) b1.remove()
        return intersect
    }


    // logCoord(coord) { return `(x:${coord.x}, y:${coord.y})` }
    // logCoords(name, elem) {
    //     return `${name}: A${this.logCoord(elem.start)} -> B${this.logCoord(elem.end)}`
    // }

    init() {
        console.log('INIT!')
        // this.localStore.reset()
        let blocks = this.localStore.blocks
        if (blocks && blocks.length > 0) {
            console.log('RESTORE START', blocks)
            blocks.forEach(block => {
                let b = this.add(block)
                if ('bin' == b.action) {
                    b.action = null
                    b.remove(false)
                }
            })
            this.history.restore()
            console.log(`RESTORE END. Desk: ${this.size()} Bin: ${this.bin.size()}`)
        } else {
            this.add(this.defaultBlocks())
            this.history.initial()
            console.log('INITIAL')
        }
    }

    defaultBlocks() {
        return mock.desktop.blocks
    }

    defaultBlockById(id) {
        return this.defaultBlocks().find(block => block.id == id)
    }

    reset() {
        console.log('RESET START')
        this.bin.restoreAll()
        this.each(block => {
            let def = this.defaultBlockById(block.id)
            if (!def) return
            for (let key in def) block[key] = def[key]
            block.historyReset()
        })
        this.history.reset()
        this.localStore.reset()
        this.history.initial()
        console.log('RESET END', this.size(), this.bin.size())
    }
}
