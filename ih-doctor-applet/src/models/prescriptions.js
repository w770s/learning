import {HTTP} from '@/util/http.js'
const GET = 'GET'
const POST = 'POST'

class prescriptions extends HTTP {

    /**处方信息接口**/
    prescriptionsCreate(data){ // create
        return this.request({
            method: POST,
            url: '/prescription/prescriptions/create',
            data: data
        })
    }

    MedicineStoreInfo(data){ // 药房信息
        return this.request({
            method: GET,
            url: '/prescription/prescriptionMedicineStoreInfo/list',
            data: data
        })
    }

    /*药品相关接口*/
    icdDisease(data){ // 临床诊断
        return this.request({
            method: GET,
            url: '/prescription/prescriptionMedicine/icdDisease',
            data: data
        })
    }

    medicineFrequencyList(data){ // 用药频率查询
        return this.request({
            method: GET,
            url: '/prescription/prescriptionMedicine/medicineFrequencyList',
            data: data
        })
    }

    medicineSearch(data){ // 药品检索
        return this.request({
            method: GET,
            url: '/prescription/prescriptionMedicine/medicineSearch',
            data: data
        })
    }

    medicineWay(data){ // 用药途径查询
        return this.request({
            method: GET,
            url: '/prescription/prescriptionMedicine/medicineWay',
            data: data
        })
    }



    orderList(data){ // 查询处方订单列表信息
        return this.request({
            method: GET,
            url: '/prescription/prescriptionOrder/orderList',
            data: data
        })
    }

    listPatientMedicalRecord(data){ // 获取某患者病历列表
        return this.request({
            method: GET,
            url: '/outpatient01/outpatientMedicalRecord/listPatientMedicalRecord',
            data: data
        })
    }

    checkMedcineIsAvailable(data){ // 校验开药信息
        return this.request({
            method: POST,
            url: '/prescription/prescriptions/checkMedcineIsAvailable',
            data: data
        })
    }

    selectHealthCardDetails(data){ // 查询健康卡详情
        return this.request({
            method: GET,
            url: '/basics/healthCard/selectHealthCardDetails',
            data: data,
        })
    }

    selectOrderDataRecord(data){ // 查询订单信息记录
        return this.request({
            method: GET,
            url: '/prescription/orderData/selectOrderDataRecord',
            data: data,
        })
    }

    getOrderDetail(data){ // id查询处方订单信息
        return this.request({
            method: GET,
            url: '/prescription/prescriptionOrder/getOrderDetail',
            data: data
        })
    }

    ihCheckInspectionInfoCreate(data){ // 创建检验/查单
        return this.request({
            method: POST,
            url: '/prescription/ihCheckInspectionInfo/create',
            data: data
        })
    }

    ihCheckInspectionInfoDetail(data){ // 查询处方订单信息
        return this.request({
            method: GET,
            url: '/prescription/ihCheckInspectionInfo/getOrderDetail',
            data: data
        })
    }

    ihInspectionOrderList(data){ // 查询检查检验处方订单列表信息
        return this.request({
            method: GET,
            url: '/prescription/ihInspectionOrder/orderList',
            data: data
        })
    }

    ihCheckInspectionInfoChecka(data){ // 检查单/检验单检索
        return this.request({
            method: POST,
            url: '/prescription/ihCheckInspectionInfo/checka',
            data: data
        })
    }

    ihCheckInspectionInfoCheckb(data){ //检验科室检索
        return this.request({
            method: POST,
            url: '/prescription/ihCheckInspectionInfo/checkb',
            data: data
        })
    }

    checkmethings(data){ // 检验标本
        return this.request({
            method: POST,
            url: '/prescription/ihCheckInspectionInfo/checkmethings',
            data: data
        })
    }

    checkmethods(data){ // 检查方法
        return this.request({
            method: POST,
            url: '/prescription/ihCheckInspectionInfo/checkmethods',
            data: data
        })
    }

    checkpoint(data){ // 检查部位
        return this.request({
            method: POST,
            url: '/prescription//ihCheckInspectionInfo/checkpoint',
            data: data
        })
    }

    ihInspectionOrderGetOrderDetail(data){ // 查询检查验订单信息
        return this.request({
            method: GET,
            url: '/prescription/ihInspectionOrder/getOrderDetail',
            data: data
        })
    }


}

export {
    prescriptions
}
