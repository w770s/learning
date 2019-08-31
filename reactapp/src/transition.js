import React , {Component , Fragment} from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './app.css'

class Transition extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.handerAddItem = this.handerAddItem.bind(this)
    }
    handerAddItem(){
        this.setState((prevState)=>{
            return {
                list : [...prevState.list,'item']
            }
        })
    }
    render() {
        return(
            <Fragment>
                <TransitionGroup>
                    {
                        this.state.list.map((item,index)=>{
                            return(
                                <CSSTransition
                                    timeout={1000}
                                    classNames='show'
                                    onEntered={(el)=>{el.style.color='yellow';}}
                                    unmountOnExit
                                    key={index}
                                >
                                <div>{item}</div>
                                </CSSTransition>
                            )
                        })
                    }
                </TransitionGroup>
                <button onClick={this.handerAddItem}>submit</button>
            </Fragment>
        )
    }

}

export default Transition
