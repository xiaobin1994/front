const state = {
  events: [],
  temp: [],
  skip: 0,
  eventItem: {}
}

const mutations = {
  getSingleEvent(state, payload) {
    state.events = payload.res
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
