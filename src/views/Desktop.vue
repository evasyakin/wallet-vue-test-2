<template>
    <div class="desktop">
        <DesktopBlock v-for="(block, key) in blocks" :key="key" :block="block"  @intersect-check="intersectCheck" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DesktopBlock from './parts/DesktopBlock'
export default {
    data () {
        return {
            offset: 10,
            halfOffset: 5
        }
    },
    computed: {
        ...mapGetters('desktop', [
            'blocks'
        ]),
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

            if (intersect) {
                b1.action = null
                let move = {
                    x: (left + right > 0) ? left - this.halfOffset : right + this.halfOffset,
                    y: (top + bottom > 0) ? top - this.halfOffset : bottom + this.halfOffset,
                }
                if (Math.abs(move.x) < Math.abs(move.y)) {
                    b1.posX += move.x
                } else {
                    b1.posY += move.y
                }
            }
        },
        intersectCheck (block) {
            let intersect = false
            for (let item of this.blocks) {
                if (block.id == item.id) continue
                if (block.intersecting && item.intersecting) continue
                intersect = this.intersect(block, item)
                if (intersect) {
                    console.error('ALARM! Intersect!')
                }
            }
            // return intersect
        },
    },
    created () {
        this.$store.dispatch('desktop/load')
    },
    components: { DesktopBlock },
};
</script>

<style>
.desktop {position: relative;}
</style>
