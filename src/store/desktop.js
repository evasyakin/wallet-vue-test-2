import api from '../api/api.js'
import Block from './models/Block.js'
// const Block = require('./models/Block.js')

// let block = new Block({title: 'kek'})
// console.log(block.test())
// console.log(block)

const state = {
    blocks: [],
    bin: [],
}

const getters = {
    blocks: state => state.blocks,
    bin: state => state.bin
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

// поиск сущности по id с вызовом колбэка для её обновления
function updateById (items, id, cb) {
    let index = items.findIndex(item => item.id == id)
    if (index === -1) console.error(`Item with id ${id} not found`)
    else cb(index, items)
}

const mutations = {
    setBlocks: (state, blocks) => {
        let _blocks = []
        blocks.forEach(block => {
            block.action = null
            block.blockUp = false
            _blocks.push(new Block(block))
        })
        state.blocks = _blocks
    },
    blockUp: (state, block) => {
        let filtered = state.blocks.slice(0)
        filtered = filtered.sort((a, b) => {
            return a.posZ - b.posZ
        })
        filtered.forEach((item, posZ) => {
            updateById(state.blocks, item.id, (index, items) => {
                items[index].posZ = items[index].id == block.id ? filtered.length : posZ
                items[index].blockUp = items[index].id == block.id
            })
        })
    },
    removeBlock: (state, block) => {
        console.log('Remove block:', block.id)
        updateById(state.blocks, block.id, (index, items) => {
            state.bin.push(items[index])
            items.splice(index, 1)
        })
    },
    restoreBlock: (state, block) => {
        console.log('Restore block:', block.id)
        updateById(state.bin, block.id, (index, items) => {
            state.blocks.push(items[index])
            items.splice(index, 1)
        })
    },
    removeBinBlock: (state, block) => {
        console.log('Real remove bin block:', block.id)
        updateById(state.bin, block.id, (index, items) => {
            items.splice(index, 1)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
