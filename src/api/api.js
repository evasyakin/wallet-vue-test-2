import mock from './mock.js'

export default {
    desktop: {
        load (cb) {
            // имитация запроса к api через таймауты
            setTimeout(() => {cb(mock.desktop.blocks)}, 100)
        },
    },
};
