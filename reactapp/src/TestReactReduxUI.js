import React from 'react';
import { Input, Button, List} from 'antd';

const TestReactReduxUI = (props)=>{ // 无状态组件 效率最高，能做则做
    return(
        <div style={{marginTop:'10px',marginLeft:'10px'}}>
            <Input
                value={props.inputValue}
                style={{width:'300px',marginRight:'10px'}}
                placeholder='todo info'
                onChange={props.handleInputChange}
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

export default TestReactReduxUI
