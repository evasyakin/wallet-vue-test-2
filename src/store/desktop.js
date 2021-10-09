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

const mutations = {
    setBlocks: (state, blocks) => {
        state.blocks = blocks
    },
    updateBlock: (state, block) => {
      let index = state.blocks.findIndex(item => item.id == block.id)
      if (index === -1) console.error(`Block with id ${block.id} not found`)
      else state.blocks[index] = block
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
