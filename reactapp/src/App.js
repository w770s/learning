import React, {Component, Fragment} from 'react';
import TodoItem from './TodoItem';
import axios from 'axios'
import './app.css';
//
// const mock = new MockAdapter(axios);
// mock.onGet('/users', { params: { searchText: 'John' } }).reply(200, {
//     users: [
//         { id: 1, name: 'John Smith' }
//     ]
// });

class App extends Component{
    constructor(props){

        super(props);
        // 当组件的state和props改变是，render 就会重新执行
        // 当父组件render 重新执行时， 子组件render 也会重新执行 虚拟DOM（效率高：就是一个js对象。用他来描述真实DOM）

        // 1.完全替换 DOM  2。差异化对比DOM 。只替换变化DOM 3。虚拟DOM（效率高）生成虚拟DOM（） state变化 （数据+模版）生成一个新的虚拟DOM ，比较，在操作DOM
        this.state={
            inputValue: 'Hello XU!!!',
            list: ['English','China','American']
        };
        this.handelInputChange = this.handelInputChange.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    handelInputChange(e){
        const value = e.target.value
        this.setState(()=>({
            inputValue: value
        }))
        // 性能优化 异步更改数据  e.target.value的在外面存一份 执行一个函数 返回一个对象 （）=== return  和下面两种一样
        // this.setState(()=>{
        //     return {
        //         inputValue: value
        //     }
        // })
        // this.setState({
        //     inputValue : e.target.value
        // })
    }

    handleButtonClick(){
        this.setState((prevState)=>({
            list : [...prevState.list,prevState.inputValue],
            inputValue: ''
        }),
            ()=>{
                // 异步设置数据完了以后的callback ，
                console.log(this.ul.querySelectorAll('div').length)
            }
        )
        // this.setState 函数中 自带一个参数 prevState（修改数据之前的state）
    }

    handleItemClick(index){
        this.setState((prevState)=>{
            const list = prevState.list
            list.splice(index,1)
            return {
                list
            }
            // es6 return 一样的话，直接 写一个就行
        })
    }

    getTodoItem(){
       return  this.state.list.map((item,index)=>{
            return <TodoItem key={index} deleteItem={this.handleItemClick} content={item} index={index}/>
        })
    }

    componentDidMount() { // 吊接口放在这里最合适

        axios.get('/api/todolist')
            .then(()=>{console.log('succ')})
            .catch(()=>{ console.log('error')})
    }

    render(){
        return(
            <Fragment>
                <div>
                    <label htmlFor={'insertArea'}>扩大点击区域</label>
                    {/*label标签一般是扩发选区作用，label上的for 用htmFor取代，style的class用className取代,防止与 类 和 label的for重复 */}
                    <input
                        id={'insertArea'}
                        className='input'
                        value={this.state.inputValue}
                        onChange={this.handelInputChange}
                    />
                    <button onClick={this.handleButtonClick}>submit</button>
                </div>
                {/*创建一个叫this.ul的ref对象，指向当前所指的ul对应dom节点*/}

                <ul ref={(ul)=>{this.ul = ul}}>{this.getTodoItem()}</ul>
            </Fragment>
        )
    }
}

export default App;
