import api from '../api/api.js'

const state = {
    blocks: [],
}

const getters = {
    blocks: state => state.blocks,
}

const actions = {
    load: ({ commit }) => {
        api.desktop.load(blocks => { commit('setBlocks', blocks) })
    },
    updateBlock: ({ commit }, block) => {
        // api.desktop.updateBlock(block) // если нужно отправить на бэк
        commit('updateBlock', block)
    },
}

// поиск сущности по id и вызов колбэк функции для её обновления
function updateById (items, id, cb) {
    let index = items.findIndex(item => item.id == id)
    if (index === -1) console.error(`Item with id ${id} not found`)
    else cb(items, index)
}

const mutations = {
    setBlocks: (state, blocks) => {
        state.blocks = blocks
    },
    updateBlock: (state, block) => {
        updateById(state.blocks, block.id, (items, index) => {
            items[index] = block
        })
    },
    blockUp: (state, block) => {
        let filtered = state.blocks.slice(0)
        filtered = filtered.sort((a, b) => {
            return a.posZ - b.posZ
        })
        filtered.forEach((item, posZ) => {
            updateById(state.blocks, item.id, (items, index) => {
                items[index].posZ = items[index].id == block.id ? filtered.length : posZ
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
