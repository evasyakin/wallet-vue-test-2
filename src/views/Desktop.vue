<template>
    <div class="desktop">
        <div class="desk">
            <Block v-for="block in desktop.models" :key="block.id" :block="block" />
        </div>
        <Bin />
        <div class="history">
            <button @click="history.undo()" class="btn" :disabled="!history.hasUndo()">
                <!-- &lt; -->↩ Undo ({{ history.undoCount() }})
            </button>
            <button @click="history.redo()" class="btn" :disabled="!history.hasRedo()">
                Redo ({{ history.redoCount() }}) ↪<!-- &gt; -->
            </button>
            <button @click="desktop.reset()" class="btn">Reset</button>
        </div>
    </div>
</template>

<script>
import Block from './parts/Block'
import Bin from './parts/Bin'
export default {
    data() {
        return {
            controlPressed: false,
        }
    },
    computed: {
        desktop() { return this.$store.desktop },
        history() { return this.desktop.history },
    },
    methods: {
        onkeydown(e) {
            if ('Control' == e.key) this.controlPressed = true
        },
        onkeyup(e) {
            if (true === this.controlPressed) {
                if ('KeyZ' == e.code) this.history.undo()
                else if ('KeyY' == e.code) this.history.redo()
            }
            if ('Control' == e.key) this.controlPressed = false
        },
    },
    created() {
        window.addEventListener('resize', this.desktop.calcCoords)
        window.addEventListener('keydown', this.onkeydown)
        window.addEventListener('keyup', this.onkeyup)
    },
    mounted() {
        this.desktop.elem = document.querySelector('#app .desktop')
        this.desktop.bin.setCoords(this.desktop.elem.querySelector('.bin'))
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.desktop.calcCoords)
        window.removeEventListener('keydown', this.onkeydown)
        window.removeEventListener('keyup', this.onkeyup)
    },
    components: { Block, Bin },
};
</script>

<style>
.desktop {overflow: hidden; position: relative;}
.desktop .history {
    position: absolute; bottom: 10px; right: 10px;
    align-items: center; display: flex;
}
.desktop .history .btn {
    background: #fff; border: solid #aaa 2px; border-radius: 5px;
    font-size: 14px; padding: 3px 6px;
}
.desktop .history .btn:nth-child(2) {margin: 0 5px;}
.desktop .history .btn:disabled {background: #ddd;}
.desktop .history .btn:not(:disabled) {cursor: pointer;}
.desktop .history .btn:not(:disabled):hover {background: #acf; border-color: #69f;}
</style>
