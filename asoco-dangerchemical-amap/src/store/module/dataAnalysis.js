const dataAnalysis = {
  state: {
    stevedoring: {}
  },
  mutations: {
    GET_STEVEDORING: (state, data) => {
      state.stevedoring = data
    }
  },
  getters: {
    stevedoring: state => state.stevedoring
  }
}
export default dataAnalysis
