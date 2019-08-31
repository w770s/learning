 import React , {Component} from 'react';
 import PropTypes from 'prop-types';

 class TodoList extends Component{
    constructor(props){
        super(props);
        this.deleteTheItem = this.deleteTheItem.bind(this)
    }
    deleteTheItem(){
        // 执行父组件的方法 ,和 vue相似 ，更简单
        const { deleteItem, index} = this.props // == this.props.deleteItem
        deleteItem(index)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) { // 性能优化
       if(nextProps.content!==this.props.content){
           return true
       }else{
           return false
       }
    }

     render() {
        const { test, content } = this.props
        return (
            <div
                onClick={this.deleteTheItem}>
                {/* dangerouslySetInnerHTML={{__html:this.props.test +'-'+ this.props.content}}>*/}
                {/*// 防止 react 自动转椅了标签如 <h1>,第一个{},js 表达式 ，第二个{},js 对象*/}
                {test}-{content}
            </div>
        )
    }

 }

 TodoList.propTypes = { // props 限定 ,注意位置
     deleteTheItem: PropTypes.func,
     index: PropTypes.oneOfType([PropTypes.number,PropTypes.array]), // 任一一种
     test: PropTypes.string
 }
 TodoList.defaultProps = {
     test: 'xulinan'
 }

 export default TodoList;
