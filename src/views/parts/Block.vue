<template>
    <div :class="blockClass" :style="blockStyle" @mousedown="moveStart">
        <div class="block-header">
            <h2 class="block-title">{{ block.title }}</h2>
            <div @mousedown="remove" class="block--remove" title="Переместить в корзину"></div>
        </div>
        <p class="block-content">{{ block.content }}</p>
        <div class="resize" @mousedown="resizeStart" title="Нажмите и тяните чтобы изменить размер блока"></div>
    </div>
</template>

<script>
export default {
    props: {
        block: { type: Object },
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
            return `left: ${this.block.posX}px; top: ${this.block.posY}px; width: ${this.block.sizeX}px; height: ${this.block.sizeY}px; z-index: ${this.block.posZ};`
        },
    },
    methods: {
        resizeStart(e) {
            e.stopPropagation()
            this.block.actionStart('resize', e)
        },
        moveStart(e) {
            this.block.actionStart('move', e)
        },
        remove(e) {
            e.stopPropagation()
            this.block.remove()
        }
    },
    created() {
        window.addEventListener('mousemove', this.block.actionProcess)
        window.addEventListener('mouseup', this.block.actionEnd)
    },
    beforeDestroy () {
        window.removeEventListener('mousemove', this.block.actionProcess)
        window.removeEventListener('mouseup', this.block.actionEnd)
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
    background: #fff; border: solid #ddd 2px; border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.1); height: 100px; width: 300px;
    position: absolute; user-select: none;
}
.desk .block-header {
    background: #eee; border-bottom: solid #ddd 2px; border-radius: 5px 5px 0 0; 
    padding: 7px 10px; position: relative;
}
.desk .block-title {font-size: 16px;}
.desk .block--remove {
    background: #fff; border: solid #ddd 2px; border-radius: 5px; cursor: pointer;
    height: 24px; width: 24px;
    position: absolute; right: 7px; top: calc(50% - 12px);
    align-items: center; display: flex; justify-content: center;
}
.desk .block--remove::before {
    background: #000; border-radius: 2px; content: ''; height: 4px; width: 14px;
}
.desk .block--remove:hover {box-shadow: 0 0 1px 1px rgba(255,0,0,.5) inset;}
.desk .block-content {border-radius: 0 0 5px 5px; font-size: 15px; padding: 10px;}

.desk .block.nonIntersecting {background: #fee;}
.desk .block.move {cursor: move;}
.desk .block.blockUp {border-color: #69f;}
.desk .block.blockUp .block-header {background: #acf; border-color: #69f;}
.desk .block.blockUp .block--remove {border-color: #69f;}
</style>
