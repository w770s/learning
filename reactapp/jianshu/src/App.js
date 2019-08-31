import React from 'react';
import {Globalstyle} from './style.js';
import {Iconfont} from './static/iconfont/iconfont.js'
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom'
import Header from './common/Header'
import Login from './page/login'
import Home from './page/home'
import Detail from './page/detail/loadable'
import Writer from './page/writer'
import store from './store'

function App() {
  return (
      <div className="App">
       <Provider store={store}>
           <Globalstyle />
           <Iconfont />
           <BrowserRouter>
               <div>
                   <Header/>
                   <Route path='/login' exact component={Login}></Route>
                   <Route path='/' exact component={Home}></Route>
                   <Route path='/writer' exact component={Writer}></Route>
                   <Route path='/detail' exact component={Detail}></Route>
               </div>
           </BrowserRouter>
           {/**exact path 完全匹配**/}
      </Provider>
    </div>
  );
}

export default App;
