<template>
    <header class="header">
        <router-link to="/desktop">Рабочий стол</router-link>
        <router-link to="/bitcoin">Биткоин транзакции</router-link>
    </header>
</template>

<style>
.header {
    align-items: center; display: flex; justify-content: center;
    background: #2c3e50;
}
.header a {color: #fff; padding: 10px; text-decoration: none;}
.header a:hover {background: rgba(255,255,255,.1);}
.header a.router-link-exact-active {background: #f00;}
</style>
