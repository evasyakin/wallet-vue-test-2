import Vue from 'vue';
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Desktop from './views/Desktop'
import Bitcoin from './views/Bitcoin'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { 
            path: '/desktop', component: Desktop,
            meta: { title: 'Рабочий стол' }
        },
        { 
            path: '/bitcoin', component: Bitcoin,
            meta: { title: 'Список биткоин транзакций' }
        },
        { path: '*', redirect: '/desktop' }
    ],
    scrollBehavior (to/*, from, savedPosition*/) {
        //https://router.vuejs.org/guide/advanced/scroll-behavior.html
        if (to.hash) { return { selector: to.hash } }
    }
})

router.afterEach((to/*, from*/) => {
    window.document.title = (to.meta.title || 'Unknown') + ' / Тестовое Кошелёк.Ру'
});

export default router;
