<template>
    <div class="desktop">
        <DesktopBlock v-for="(block, key) in blocks" :key="key" :block="block" />
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
    created () {
        this.$store.dispatch('desktop/load')
    },
    components: { DesktopBlock },
};
</script>
<style>
.desktop {position: relative;}
</style>
