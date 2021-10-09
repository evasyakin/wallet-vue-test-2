<template>
    <div id="app">
        <Header />
        <router-view/>
    </div>
</template>

<script>
import Header from './views/parts/Header'
export default {
    components: { Header }
};
</script>

<style>
*, *::before, *::after {box-sizing: border-box; margin: 0; padding: 0; vertical-align: top;}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    background: #f5f5f5; color: #2c3e50; text-align: center;
    min-height: 100vh;
}
.page {padding: 10px;}
</style>
