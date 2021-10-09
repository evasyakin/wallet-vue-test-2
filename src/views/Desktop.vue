<template>
    <div class="desktop">
        <DesktopBlock v-for="(block, key) in blocks" :key="key" :block="block"  @intersect-check="intersectCheck" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DesktopBlock from './parts/DesktopBlock'
export default {
    computed: {
        ...mapGetters('desktop', [
            'blocks'
        ]),
    },
    methods: {
        intersect (b1, b2) {
            return !(
                b1.posX > (b2.posX + b2.sizeX) || (b1.posX + b1.sizeX) < b2.posX ||
                b1.posY > (b2.posY + b2.sizeY) || (b1.posY + b1.sizeY) < b2.posY
            )
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
