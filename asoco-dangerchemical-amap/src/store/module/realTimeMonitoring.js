const realTimeMonitoring = {
  state: {
    carInfoRefresh: {},
    carNo: ''
  },
  mutations: {
    carInfoRefresh: (state, data) => {
      state.carInfoRefresh = data
      state.carNo = data.carNo
    }
  },
  getters: {
    carInfoRefresh: state => state.carInfoRefresh,
    carNo: state => state.carNo
  }
}
export default realTimeMonitoring
