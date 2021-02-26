export default {
  name: 'renderContent',
  functional: true,
  props: {
    render: Function,
    column: Object
  },
  render: (h, ctx) => {
    const params = {
      column: ctx.props.column
    }
    return ctx.props.render(h, params)
  }
}
