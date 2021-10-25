<template>
    <div class="desktop">
        <div class="desk">
            <DesktopBlock 
                v-for="(block, key) in blocks" :key="key" 
                :block="block"  
                @intersect-check="intersectCheck"
            />
        </div>
        <DesktopBin 
            @restore-block="restoreBlock" 
            @restore-all-blocks="restoreAllBlocks"
            @remove-bin-block="removeBinBlock"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DesktopBlock from './parts/DesktopBlock'
import DesktopBin from './parts/DesktopBin'
export default {
    data () {
        return {
            offset: 10,
            halfOffset: 5,
            desktopNode: null,
            desktopSize: {x: 0, y: 0},
            binPos: {x: 0, y: 0},
        }
    },
    computed: {
        ...mapGetters('desktop', [ 'blocks' ]),
    },
    methods: {
        intersect (b1, b2) {
            // return !(
            //     (b1.posX + b1.sizeX) < b2.posX || // слева
            //     (b1.posY + b1.sizeY) < b2.posY || // сверху
            //     b1.posX > (b2.posX + b2.sizeX) || // справа
            //     b1.posY > (b2.posY + b2.sizeY) // снизу
            // )
            let left = b2.posX - (b1.posX + b1.sizeX) - this.halfOffset
            let top = b2.posY - (b1.posY + b1.sizeY) - this.halfOffset
            let right = (b2.posX + b2.sizeX) - b1.posX + this.halfOffset
            let bottom = (b2.posY + b2.sizeY) - b1.posY + this.halfOffset
            let intersect = !(left >= 0 || top >= 0 || right <= 0 || bottom <= 0)


            // Ограничение на перенос карточки в нулевые координаты (вверх и влево)
            let boxLeft = b1.posX < 0 // this.halfOffset
            let boxTop = b1.posY < 0 // this.halfOffset
            let boxRight = b1.posX + b1.sizeX > this.desktopSize.x
            let boxBottom = b1.posY + b1.sizeY > this.desktopSize.y
            let intersectBox = boxLeft || boxTop || boxRight || boxBottom
            // if (intersectBox) {
            //     // b1.action = null
            //     if (boxLeft) b1.posX = this.halfOffset * 2
            //     else b1.posY = this.halfOffset * 2
            // }

            if (intersect) {
                boxLeft = b1.posX < 0 // this.halfOffset
                if (b2.posY + this.offset < b1.sizeY) boxTop = true // this.halfOffset
                let upd = {
                    x: (left + right > 0 && !boxLeft) ? left - this.halfOffset : right + this.halfOffset,
                    y: (top + bottom > 0 && !boxTop) ? top - this.halfOffset : bottom + this.halfOffset,
                    // sizeX: (left + right > 0) ? left - this.halfOffset : right + this.halfOffset,
                    // sizeY: (top + bottom > 0) ? top - this.halfOffset : bottom + this.halfOffset,
                    // sizeX: тут можно сделать ограничение для resize
                    // sizeY: муторно, но тоже можно сделать :)
                }
                console.log(b1.action)
                let dir = Math.abs(upd.x) - Math.abs(upd.y)
                if (dir < 0) {
                    if (['move', null].includes(b1.action)) b1.posX += upd.x
                    else if ('resize' == b1.action) {
                        b1.sizeX += upd.x
                        b1.action = null
                    }
                } else if (dir > 0) {
                    if (['move', null].includes(b1.action)) b1.posY += upd.y
                    else if ('resize' == b1.action) {
                        b1.sizeY -= upd.y
                        b1.action = null
                    }
                }
                if (dir !== 0) {
                    // b1.action = null
                }
            } else if (intersectBox) {
                if (boxLeft) b1.posX = this.offset
                if (boxRight) b1.posX = this.desktopSize.x - this.offset - b1.sizeX
                if (boxTop) b1.posY = this.offset
                if (boxBottom) b1.posY = this.desktopSize.y - this.offset - b1.sizeY
            }

            // Наработки по увеличению области при переносе карточки 
            // в отрицательные координаты (вверх и влево)
            // 
            // let leftUp = this.halfOffset - b1.posX
            // if (leftUp > 0) {
            //     // this.desktopNode.scrollLeft = leftUp
            //     this.blocks.forEach(block => {
            //         if (block.id !== b1.id) block.posX += leftUp
            //     })
            // }
            // let topUp = this.halfOffset - b1.posY
            // if (topUp > 0) {
            //     // this.desktopNode.scrollTop = topUp
            //     this.blocks.forEach(block => {
            //         if (block.id !== b1.id) block.posY += topUp
            //     })
            // }

            return intersect
        },
        intersectCheck (block) {
            let intersect = false
            // Удаляем блок, если он попал в зону корзины
            if (block.posX + block.sizeX > this.binPos.x && block.posY + block.sizeY > this.binPos.y) {
                this.removeBlock(block)
            }
            for (let item of this.blocks) {
                if (block.id == item.id) continue
                if (block.intersecting && item.intersecting) continue
                intersect = this.intersect(block, item)
                if (intersect) {
                    console.error('ALARM! Intersect!', item.id)
                }
            }
            // return intersect
        },
        removeBlock (block) {
            block.action = null
            block.blockUp = false
            this.$store.commit('desktop/removeBlock', block)
            console.log('removed')
        },
        restoreBlock (block) {
            this.$store.commit('desktop/restoreBlock', block)
            block.posX = Math.floor((this.desktopSize.x - block.sizeX) / 2)
            block.posY = Math.floor((this.desktopSize.y - block.sizeY) / 2)
            this.intersectCheck(block)
        },
        removeBinBlock (block) {
            if (confirm(`Вы точно хотите удалить блок "${block.title}"?`))
                this.$store.commit('desktop/removeBinBlock', block)
        },
        restoreAllBlocks () {
            let bin = this.$store.getters['desktop/bin']
            console.log('restoreAllBlocks', bin)
            bin.forEach(block => {
                this.restoreBlock(block)
            })
        },
        setDesktopSize () {
            this.desktopSize.x = this.desktopNode.offsetWidth
            this.desktopSize.y = this.desktopNode.offsetHeight
        },
        setBinPos () {
            let binNode = this.desktopNode.querySelector('.bin')
            this.binPos.x = binNode.offsetLeft
            this.binPos.y = binNode.offsetTop
        },
    },
    created () {
        this.$store.dispatch('desktop/load')
    },
    mounted () {
        this.desktopNode = document.querySelector('#app .desktop')
        let y = this.desktopNode.offsetTop
        this.desktopNode.style.minHeight = `calc(100vh - ${y}px)`
        this.setDesktopSize()
        this.setBinPos()
        window.addEventListener('resize', this.setDesktopSize)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.setDesktopSize)
    },
    components: { DesktopBlock, DesktopBin },
};
</script>

<style>
.desktop {overflow: hidden; position: relative;}
</style>
