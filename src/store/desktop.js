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
}

const mutations = {
    setBlocks: (state, blocks) => {
        state.blocks = blocks
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
