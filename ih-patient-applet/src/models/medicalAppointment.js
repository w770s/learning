import {HTTP} from '../util/http.js'
const GET = 'GET'
const POST = 'POST'

class medicalAppointmentModel extends HTTP {
/**
  设置接口
**/

	addAppointment(data) { // 添加预约体检信息
		return this.request({
			method: POST,
			url: '/ems/checkupAppointment/addAppointment',
			data
		})
	}

	getListPackage(data){ // 获取体检套餐
		return this.request({
			method: GET,
			url: '/ems/package/getListPackage',
			data: data,
		})
	}

	listPackageCombos(data){ // 获取体检套餐项目明细
		return this.request({
			method: GET,
			url: '/ems/package/listPackageCombos',
			data: data,
		})
	}

	checkmePrices(data) { // 检验价格
		return this.request({
			method: POST,
			url: '/prescription/ihCheckInspectionInfo/checkmePrices',
			data
		})
	}
	
	medicineSearch(data) { // 药品检索
		return this.request({
			method: GET,
			url: '/prescription/prescriptionMedicine/medicineSearch',
			data
		})
	}


}

export {
	medicalAppointmentModel
}
