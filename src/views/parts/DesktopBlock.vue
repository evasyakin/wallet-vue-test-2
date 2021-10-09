<template>
    <div class="block" :style="blockStyle">
        <h2 class="block-title">{{ block.title }}</h2>
        <p class="block-content">{{ block.content }}</p>
    </div>
</template>

<script>
export default {
    props: { 
        block: { type: Object },
    },
    computed: {
        blockStyle () {
            return `left: ${this.block.posX}px; top: ${this.block.posY}px; width: ${this.block.sizeX}px; height: ${this.block.sizeY}px;`
        },
    },
};
</script>

<style>
.block {
    height: 100px; width: 300px;
    background: #fff; box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    border-radius: 5px; padding: 10px;
    position: absolute;
}
.block-title {border-bottom: solid #ddd 1px; font-size: 16px; margin-bottom: 10px; padding-bottom: 10px;}
.block-content {font-size: 15px;}
</style>
