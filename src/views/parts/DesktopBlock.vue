<template>
    <div class="block" :style="blockStyle" @mousedown="moveStart">
        <h2 class="block-title">{{ block.title }}</h2>
        <p class="block-content">{{ block.content }}</p>
        <div class="resize" @mousedown="resizeStart" title="Нажмите и тяните чтобы изменить размер блока"></div>
    </div>
</template>

<script>
export default {
    props: { 
        block: { type: Object },
    },
    data () {
        return {
            resize: false,
            move: false,
            desktopOffset: {x: 0, y: 0},
            cursorOffset: {x: 0, y: 0},
        }
    },
    computed: {
        blockStyle () {
            let style = `left: ${this.block.posX}px; top: ${this.block.posY}px; width: ${this.block.sizeX}px; height: ${this.block.sizeY}px; z-index: ${this.block.posZ};`
            if (this.move) style += ' cursor: move;'
            return style
        },
    },
    methods: {
        setCursorOffset (e) {
            let [x, y] = this.getNodeFullOffset(e.target)
            x = e.pageX - x
            y = e.pageY - y
            this.cursorOffset = {x, y}
        },
        getNodeFullOffset (node) {
            let x = 0, y = 0
            while (node) {
                x += node.offsetLeft
                y += node.offsetTop
                node = node.offsetParent
            }
            return [x, y]
        },

        resizeStart (e) {
            e.stopPropagation()
            this.resize = true
            this.blockUp()
            this.setCursorOffset(e)
        },
        resizeProcess (e) {
            if (this.resize) {
                this.$emit('intersect-check', this.block) // проверяем пересечения
                this.block.sizeX = e.pageX - this.block.posX - this.desktopOffset.x + this.cursorOffset.x
                this.block.sizeY = e.pageY - this.block.posY - this.desktopOffset.y + this.cursorOffset.y
            }
        },
        resizeEnd () {
            if (this.resize) {
                this.resize = false
                this.updateBlock()
            }
        },

        moveStart (e) {
            this.move = true
            this.blockUp()
            this.setCursorOffset(e)
        },
        moveProcess (e) {
            if (this.move) {
                this.$emit('intersect-check', this.block) // проверяем пересечения
                this.block.posX = e.pageX - this.desktopOffset.x - this.cursorOffset.x
                this.block.posY = e.pageY - this.desktopOffset.y - this.cursorOffset.y
            }
        },
        moveEnd () {
            if (this.move) {
                this.move = false
                this.updateBlock()
            }
        },

        blockUp () {
            this.$store.commit('desktop/blockUp', this.block)
        },

        updateBlock () {
            this.$store.dispatch('desktop/updateBlock', this.block)
        },
    },
    created () {
        window.addEventListener('mousemove', this.resizeProcess)
        window.addEventListener('mouseup', this.resizeEnd)
        window.addEventListener('mousemove', this.moveProcess)
        window.addEventListener('mouseup', this.moveEnd)
    },
    mounted () {
        let desktopNode = document.querySelector('#app .desktop')
        this.desktopOffset.y = desktopNode.offsetTop
        this.desktopOffset.x = desktopNode.offsetLeft
    },
};
</script>

<style>
.block {
    height: 100px; width: 300px;
    background: #fff; box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    border-radius: 5px; padding: 10px;
    position: absolute; user-select: none;
}
.block-title {border-bottom: solid #ddd 1px; font-size: 16px; margin-bottom: 10px; padding-bottom: 10px;}
.block-content {font-size: 15px;}
.resize {
    height: 20px; width: 20px; padding-top: 10px; overflow: hidden;
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%); cursor: nw-resize;
    position: absolute; bottom: 1px; right: 1px;
}
.resize::before, .resize::after {
    display: block; content: '';
    border-bottom: solid 1px #333; border-top: solid 1px #333;
    height: 3px; width: 30px;
    transform: rotate(-45deg);
}
.resize::before {}
.resize::after {margin-top: 3px;}
</style>
