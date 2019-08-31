// UI 组件（渲染）--》 改为无状态组件
import React from 'react';
import { Input, Button, List} from 'antd';

const AntDUI = (props) => {
    return(
        <div style={{marginTop:'10px',marginLeft:'10px'}}>
            <Input
                value={props.inputValue}
                style={{width:'300px',marginRight:'10px'}}
                placeholder='todo info'
                onChange={props.inputValueChange}
            />
            <Button type="primary" onClick={props.handleStoreSubmit}>提交</Button>
            <List
                style={{width:'300px',marginTop:'10px'}}
                bordered
                dataSource={props.list}
                renderItem={(item, index) => (<List.Item onClick={()=>{props.handleDeleteItem(index)}}>{item}</List.Item>)}
            />
        </div>
    )
}


// class AntDUI extends Component{
//     render() {
//         return(
//             <div style={{marginTop:'10px',marginLeft:'10px'}}>
//                 <Input
//                     value={this.props.inputValue}
//                     style={{width:'300px',marginRight:'10px'}}
//                     placeholder='todo info'
//                     onChange={this.props.inputValueChange}
//                 />
//                 <Button type="primary" onClick={this.props.handleStoreSubmit}>提交</Button>
//                 <List
//                     style={{width:'300px',marginTop:'10px'}}
//                     bordered
//                     dataSource={this.props.list}
//                     renderItem={(item, index) => (<List.Item onClick={()=>{this.props.handleDeleteItem(index)}}>{item}</List.Item>)}
//                 />
//             </div>
//         )
//     }
// }

export default AntDUI
