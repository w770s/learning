import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.role
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style = 'display: none;'
        // el.parentNode && el.parentNode.removeChild(el)
      } else {
        el.style = 'display: inline;'
      }
    } else {
      throw new Error(`权限异常 v-permission="['edit','add']"`)
    }
  },
  update(el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.role
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.style = 'display: none;'
        // el.parentNode && el.parentNode.removeChild(el)
      } else {
        el.style = 'display: inline;'
      }
    } else {
      throw new Error(`权限异常 v-permission="['edit','add']"`)
    }
  }
}
