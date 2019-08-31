import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ReactDom from 'react-dom';
import axios from 'axios';
import Home from './home';
import List from './list';

class App extends Component{
    componentDidMount() { // 代理
        axios.get('/api/header.json').then((res) => {
            console.log(res)
        })
    }

    render() {
        return (
           <BrowserRouter>
               <div>
                   <Route path="/" exact component={Home} />
                   <Route path="/list" component={List} />
               </div>
           </BrowserRouter>
        )
    }
}

ReactDom.render(<App />, document.getElementById('root'));
