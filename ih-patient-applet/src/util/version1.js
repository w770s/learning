version1 = [
    {
        "name": '全部科室',
        "type": 'hierarchy',
        "submenu": [{
            "name": "全部科室",
            "value": "全部科室"
        }]
    },
    {
        "name": '全部职称',
        "type": 'hierarchy',
        "submenu": [
            {
                "name": "全部职称",
                "value": "全部职称"
            },
            {
                "name": "主治医师",
                "value": "主治医师"
            },
            {
                "name": "副主任医师",
                "value": "副主任医师"
            },
            {
                "name": "科室专家",
                "value": "科室专家"
            },
            {
                "name": "门诊医生",
                "value": "门诊医生"
            }
        ]
    },
]

version2 = [
    {
        "name": '全部科室',
        "type": 'hierarchy',
        "submenu": [{
            "name": "全部科室",
            "value": "全部科室"
        }]
    }
]


loginMedicalservices = [
    {
        name: '我的订单',
        itemImage: [
            {
                name: '咨询订单',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/consultingOrder.png'
            },
            {
                name: '复诊订单',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/InterrogationIcon.png'
            },
            {
                name: '处方订单',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/prescriptionIcon.png'
            },
            {
                name: '我的消息',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/myNews.png'
            },
            {
                name: '我的问卷',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/myQuestion.png'
            }
        ]
    },
    {
        name: '常用工具',
        itemImage: [
            {
                name: '健康卡',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/healthyCard.png'
            },
            {
                name: '设置',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/setting.png'
            },
            {
                name: '医保电子凭证',
                imgIcon: 'http://file.aihuihc.com/patient/patientImages/images/login/socialSecurity.png'
            }
        ]
    }
]

homeSkeleton = {
    videoFour: [
        {
            titleName: '免疫力如何提高？',
            pagePath: 'http://file.aihuihc.com/patient/patientImages/images/newHome/test1.mp4'
        },
        {
            titleName: '头疼该怎么办？',
            pagePath: 'http://file.aihuihc.com/patient/patientImages/images/newHome/test1.mp4'
        },
        {
            titleName: '免疫力如何提高？',
            pagePath: 'http://file.aihuihc.com/patient/patientImages/images/newHome/test1.mp4'
        },
        {
            titleName: '头疼该怎么办？',
            pagePath: 'http://file.aihuihc.com/patient/patientImages/images/newHome/test1.mp4'
        }
    ],
    twoMenuBar: [
        {
            grade: 2,
            name: '体检报告',
            imageUrl: ''
        },
        {
            grade: 2,
            name: '住院服务',
            imageUrl: ''
        },
        {
            grade: 2,
            name: '检查检验',
            imageUrl: ''
        },
        {
            grade: 2,
            name: '门诊病历',
            imageUrl: ''
        },
        {
            grade: 2,
            name: '远程会诊',
            imageUrl: ''
        }
    ],
    oneMenuBar: [
        {
            grade: 1,
            name: '预约挂号',
            imageUrl: ''
        },
        {
            grade: 1,
            name: '在线就诊',
            imageUrl: ''
        }
    ]
}

module.exports = {
    version1,
    version2,
    homeSkeleton,
    loginMedicalservices
}
