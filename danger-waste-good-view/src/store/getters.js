const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userPermission: state => state.user.permission,
  // 全局字典
  dictionary: state => state.app.dictionary,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  character: state => state.user.role,
  name: state => state.user.account,
  role: state => state.user.permission,
  // 是否重置了权限路由
  hasPermission: state => state.user.hasPermission,
  enterpriseCode: state => state.user.enterpriseCode,
  enterpriseName: state => state.user.enterpriseName,
  permission_routes: state => state.permission.routes
}
export default getters
