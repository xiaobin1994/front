import Vue from 'vue'
import Vuex from 'vuex'

import memberStore from '../components/member/memberStore'
import appointmentStore from '../components/appointment/appointmentStore'

import records from './modules/records'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    records,
    memberStore,
    appointmentStore,
  }
})
