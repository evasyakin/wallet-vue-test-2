<template>
    <div class="bin" :style="binStyle">
        <div v-if="bin.opened" class="bin-blocks">
            <div v-for="(block, key) in bin.models" :key="key" class="block">
                <div class="block-title">{{ block.title }}</div>
                <div class="btn btn--restore" @click="block.restore">Восстановить</div>
                <div class="btn btn--remove" @click="block.remove">Удалить</div>
            </div>
            <div v-if="bin.size()" class="btn btn--restore-all" @click="bin.restoreAll">
                Восстановить все
            </div>
            <div v-else class="bin-empty">
                Пусто. После перенеоса блока в корзину его можно восстановить или удалить.
            </div>
        </div>
        <div class="btn btn--open" @click="bin.openingToggle">
            {{ bin.opened ? 'Свернуть корзину' : 'Корзина' }} (<b>{{ bin.size() }}</b>)
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            opened: false,
        }
    },
    computed: {
        bin() { return this.$store.desktop.bin },
        binStyle() { return `z-index: ${this.$store.desktop.size()}` }
    },
};
</script>

<style>
.bin {
    bottom: 100px; position: absolute; right: 100px;
    align-items: flex-end; display: flex; flex-direction: column;
}
.bin-blocks {
    background: #fff; border-radius: 5px; box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    margin-bottom: 5px; max-width: 400px;
}
.bin-empty {max-width: 240px; padding: 10px;}
.bin .block {align-items: center; border-bottom: solid #eee 1px; display: flex; padding: 8px 10px;}
.bin .block-title {padding: 5px 10px;}
.bin .btn {
    background: #eee; border: solid #ddd 2px; border-radius: 5px;
    cursor: pointer; font-size: 14px; padding: 3px 6px;
}
.bin .btn--open {background: #fff; border-color: #aaa; font-size: 16px; padding: 6px 12px;}
.bin .btn--restore {}
.bin .btn--remove {background: #fee; margin-left: 6px;}
.bin .btn--restore-all {color: #555; display: inline-block; margin: 6px;}
.bin .btn:hover {background: #acf; border-color: #69f;}
</style>
