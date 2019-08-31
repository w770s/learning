import React, {Component} from 'react' // 多页面导报配置
import ReactDom from 'react-dom'
import Child from './child/'
class App extends Component{
    render() {
        return (
            <div>
                <div>Home</div>
                <Child />
                <div>我是多页面</div>
            </div>
        )
    }
}

ReactDom.render(<App />, document.getElementById('root'))
