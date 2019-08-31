import {fromJS,List} from "immutable";
import {actionTypes} from './index'

function selectDetail(data,id){
    let content = ''
    data.map((item)=>{
        if(item.id===id){
            console.log(item.detail)
            content = item.detail
        }
        else{
            if(item.id===1){
                content = item.detail
            }
        }
    })
    return content
}

export const getDetailPage=(id)=>({
    type: actionTypes.GET_MORE_ARTICLEDETAIL,
    id
})

export const showDetailPage=(data,id)=>({
    type: actionTypes.SHOW_DETAIL_PAGEDETAIL,
    data: fromJS(selectDetail(data,id)),
    id
})



