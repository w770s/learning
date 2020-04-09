#统计分析后续数据对接开发说明
## 模块结构
```shell
└── components     封装的echart组件
    ├── barChart  
    └── lineChart
    └── pirChart
    └── lineChart  
└──carAndCompany 原型图左上
└──mapOverview 原型图中上
└──loadGoods 原型图右上
└──flowRank 原型图左下
└──goodsTime 原型图中下
└──unloadGoods 原型图右下
```
## 需要注意的地方
+ 我根据原型图的6张个数据展示模块分为了6个组件。建议接口上也根据组件来划分，如果数据都在一个接口，请妥善使用vuex。  
+ 前端在编写请求方法时请写在对应的组件内，尽量不要写在DataAnalysis.vue。  
+ 地图打点需求并没有封装进mapOver组件，这里给一个参考地址 [https://lbs.amap.com/api/amap-ui/demos/amap-ui-pointsimplifier/star]，基本是和例子是一样的需求  
+ 组件中的data假数据是传入组件的数据格式，拿到接口数据后请整理成这样的格式
+ 有问题请及时沟通


