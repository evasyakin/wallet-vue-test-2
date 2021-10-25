<template>
    <div :class="blockClass" :style="blockStyle" @mousedown="moveStart">
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
            desktopOffset: {x: 0, y: 0},
            cursorOffset: {x: 0, y: 0},
        }
    },
    computed: {
        blockClass () {
            let className = 'block'
            if (!this.block.intersecting) className += ' nonIntersecting'
            if (this.block.blockUp) className += ' blockUp'
            if ('move' == this.block.action) className += ' move'
            return className
        },
        blockStyle () {
            let style = `left: ${this.block.posX}px; top: ${this.block.posY}px; width: ${this.block.sizeX}px; height: ${this.block.sizeY}px; z-index: ${this.block.posZ};`
            // if ('move' == this.block.action) style += ' cursor: move;'
            // if (!this.block.intersecting) style += 'background: #eeffff;'
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
            this.block.action = 'resize'
            // this.$emit('intersect-check', this.block) // проверяем пересечения
            this.blockUp()
            this.setCursorOffset(e)
        },
        resizeProcess (e) {
            if ('resize' == this.block.action) {
                this.$emit('intersect-check', this.block) // проверяем пересечения
                this.block.sizeX = e.pageX - this.block.posX - this.desktopOffset.x + this.cursorOffset.x
                this.block.sizeY = e.pageY - this.block.posY - this.desktopOffset.y + this.cursorOffset.y
            }
        },
        resizeEnd () {
            if ('resize' == this.block.action) {
                this.$emit('intersect-check', this.block) // проверяем пересечения
                this.block.action = null
            }
        },

        moveStart (e) {
            this.block.action = 'move'
            this.blockUp()
            this.setCursorOffset(e)
        },
        moveProcess (e) {
            if ('move' == this.block.action) {
                this.block.posX = e.pageX - this.desktopOffset.x - this.cursorOffset.x
                this.block.posY = e.pageY - this.desktopOffset.y - this.cursorOffset.y
                this.$emit('intersect-check', this.block) // проверяем пересечения
            }
        },
        moveEnd () {
            if ('move' == this.block.action) {
                this.$emit('intersect-check', this.block) // проверяем пересечения
                console.log('-- end move')
                // this.$emit('intersect-check', this.block) // проверяем пересечения
                // this.$emit('intersect-check', this.block) // проверяем пересечения
                // this.$emit('intersect-check', this.block) // проверяем пересечения
                console.log('-- final end move')
                this.block.action = null
            }
        },

        blockUp () {
            this.$store.commit('desktop/blockUp', this.block)
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
.resize {
    height: 20px; width: 20px; padding-top: 10px; overflow: hidden;
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%); cursor: nw-resize;
    position: absolute; bottom: 1px; right: 1px;
}
.resize::before, .resize::after {
    display: block; content: '';
    border-bottom: solid 1px #333; border-top: solid 1px #333;
    height: 3px; width: 30px; transform: rotate(-45deg);
}
.resize::after {margin-top: 3px;}

.desk .block {
    height: 100px; width: 300px;
    background: #fff; box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    border: solid #ddd 2px; border-radius: 5px;
    position: absolute; user-select: none;
}
.desk .block-title {
    background: #eee; border-bottom: solid #ddd 2px; border-radius: 5px 5px 0 0; 
    font-size: 16px; padding: 7px 10px;
}
.desk .block-content {border-radius: 0 0 5px 5px; font-size: 15px; padding: 10px;}

.desk .block.nonIntersecting {background: #fee;}
.desk .block.move {cursor: move;}
.desk .block.blockUp {border-color: #69f;}
.desk .block.blockUp .block-title {background: #acf; border-color: #69f;}
</style>
