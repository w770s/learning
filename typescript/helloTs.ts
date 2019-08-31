// function sayName(name: string) {
//     return 'hello'+ name
// }
//
// let person = '1211221'

//(1) 基本数据类型

// Boolean Boolean 构造函数返回一个对象

// let happy:Boolean = new Boolean(1)
// let happy:boolean = Boolean(1)
// let happy:boolean = false

// number

// let num:number = 12

// string

// let classMate:string = 'five'
// let year:number = 20
// let subject:string = `hello welcome to our ${classMate} class you are ${year} and old enough to study`;

// 空值 在 TypeScript 中，可以用 void 表示没有任何返回值的函数
// function sayYes():void {
//     console.log('1')
// }
//
// let voidN:void = undefined

// Null 和 Undefined  //undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null
//与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量：
//而 void 类型的变量不能赋值给 number 类型的变量
//
// let car:null = null
// let cars:undefined = undefined
// let u:null
// let hah:number = u
// let a:void
// let b:number = a //Type 'void' is not assignable to type 'number'



// (2)任意值 ：用来表示允许赋值为任意类型

// let a:any = 12
// a = 'sd'
// a.history() // 声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值
//
// let b // 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：
// b=12
// b='121'


// (3) 类型推论  如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型
// TypeScript 会在没有明确的指定类型的时候推测出一个类型 ,如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查
// let number 可行 any
// number = 12
// number = '123'

// let number = 12 // error  类型推论 为 number like  let number:number = 12
// number = 'qwewq'


//(4) 联合类型 : 表示取值可以为多种类型中的一种 联合类型使用 | 分隔每个类型

// function sayName(name: string|number):string { //
//     // return 'hello'+ name.length //当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法
//     return name.toString() // 共有
// }


//(5) 对象的类型——接口 : TypeScript 中，我们使用接口（Interfaces）来定义对象的类型
// ? :  什么是接口  ： 对行为的抽象 ，具体用类去实现（class）
// 非常灵活： 除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

// interface Person {
//     name: string,
//     year: number
// }
// // 赋值的时候，变量的形状必须和接口的形状保持一致,多一些，少一些属性都不行
// let tom: Person ={
//     name: '123',
//     year: 1231
// }

// 可选属性
//
// interface Person {
//     name: string;
//     age?: number; //？ 可选属性的含义是该属性可以不存在，仍然不允许添加未定义的属性
// }
//
// let tom: Person = {
//     name: 'Tom'
// };


// 任意属性
// interface yeas {
//     name:string,
//     year?:number,
//     // [propName:string]: any // 定义了任意属性取 string 类型的值(key)。
//     [propName:string]: string // 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：
// }
//
// let tom:yeas={
//     name:'tom',
//     year: 25, // Type '{ name: string; year: number; personName: string; }' is not assignable to type 'yeas'.
//     personName: '1212'
// }

// 只读属性 : 希望对象中的一些字段只能在创建的时候被赋值

// interface hello {
//     readonly id: number,
//     name: string,
//     age?: number,
//     [propName:string]:any
// }
// // 注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
// let tom: hello={
//     id: 1212,
//     name: 'tom',
//     gentlemen: '123123'
// }


// (6) 数组的类型

// first [类型 + []]
// let arrayCombinateL:number[]=[1,2,2,3,12]
// let arrayForm:any[]= [12,'123',{'q':12}]
// arrayCombinateL.push(12) // 数组的一些方法的参数也会根据数组在定义时约定的类

// second 数组泛型（Array Generic） Array<elemType>
// let arrayForm:Array<number|string> = [1,2,3,4,2,'12121']

// third 用接口表示数组
// interface NumberArray {
//     [index: number]:(number|string)
// }
// let arrayForm:NumberArray=['1',2,232,12,1]
//NumberArray 表示：只要 index 的类型是 number，那么值的类型必须是 number

// four 类数组 : 不是数组类型，比如 argument
// 常见的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection

// function sum() {
//     let args:IArguments = arguments
// }


// (7) 函数的类型

// first 定义函数方式
// 函数申明
// function statement(x,y) {
//     return x + y
// }
//一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到:
//输入多余的（或者少于要求的）参数，是不被允许的
// function statement(x:number,y:number):number {
//     return x + y
// }
// console.log(statement(1,2))

// 函数表达式
// let myName = function (x,y) {
//     return x + y
// }
// let myName = function (x:number,y:number) :number { // myName 赋值操作进行类型推论而推断出来的
//     return x + y
// }
// 如果需要我们手动给 mySum 添加类型：如下
//注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>
// TTypeScript 的类型定义中, => 用来表示函数的定义 ,左侧是输入类型（需要用括号扩起来），右侧是输出类型
// let myName:(x:number,y:number)=>number = function (x:number,y:number):number {
//     return x + y
// }

// 用接口定义函数的形状
// interface perspect {
//     (a:number,b:string):boolean
// }
// let car:perspect;
// car = function (a:number,b:string){
//     return a+b!==''
// }

//可选参数 :?
//注意 可选参数必须接在必需参数后面
// function sayHe(a:number,b?:string) {
//     if(b){
//         return a + b
//     }
//     else{
//         return a
//     }
// }

// 参数默认值 .「可选参数必须接在必需参数后面」的限制了：
// function car(b:string = 'tom',a:number ) {
//     return(a+b)
// }

// 剩余参数
// ...rest 的方式获取函数中的剩余参数 .事实上，items 是一个数组。所以我们可以用数组的类型来定义它
// 注意，rest 参数只能是最后一个参数
// function car(a:number,...rest:any[]) {
//     rest.map((item)=>console.log(item))
// }
// car(1,2123123,231233)

// 重载
// 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理
// function reverse(a:number|string):number|string {
//     if(typeof a === "number"){
//         return Number(a.toString().split(' ').reverse().join(' '))
//     }    else if(typeof a === "string"){
//         return a.split(' ').reverse().join(' ')
//     }
// }
// 缺点：不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。
// 使用重载定义多个 reverse 的函数类型
// 注意，TypeScript 会优先从最前面的函数定义开始匹配
// 前几次都是函数定义，最后一次是函数实现
// function reverse(a:number):number
// function reverse(a:string):string
// function reverse(a:number|string):number|string {
//     if(typeof a==='number'){
//         return Number(a.toString().split(' ').reverse().join(' '))
//     }
//     else if(typeof a==='string'){
//         return a.split(' ').reverse().join(' ')
//     }
// }

// (8) 类型断言 : 可以用来手动指定一个值的类型
// 语法 1.<类型>值 2.值 as 类型(在 tsx 语法（React 的 jsx 语法的 ts 版）中必须用后一种。)
// 主要使用在联合类型函数内判断上
// 注意 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的
// function car(a:number|string):string|number {
//     if(a.length){ // 只能使用联合类型中都有 的属性
//         return a.length
//     }
//     else {
//         return a.toString().length
//     }
// }
// 断言
// function car(a:number|string):string|number {
//     // if((<string>a).length){
//     //     return (<string>a).length
//     // }
//     if((a as string).length) {
//         return (a as string).length
//     }else {
//         return a.toString().length
//     }
// }

// (9) 申明文件 ： 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能
// 新语法索引
// declare var 声明全局变量
// declare function 声明全局方法
// declare class 声明全局类
// declare enum 声明全局枚举类型
// declare namespace 声明（含有子属性的）全局对象
// interface 和 type 声明全局类型
// export 导出变量
// export namespace 导出（含有子属性的）对象
// export default ES6 默认导出
// export = commonjs 导出模块
// export as namespace UMD 库声明全局变量
// declare global 扩展全局变量
// declare module 扩展模块
// /// <reference /> 三斜线指令

// 什么是声明语句
// $('#foo');
// // or
// jQuery('#foo');
// ts 中不认识
// declare var jQuery: (selector: string) => any;
// jQuery('#foo');
// declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。它编译结果是：

// 什么是声明文件
// 声明语句放到一个单独的文件（jQuery.d.ts）中，声明文件必需以 .d.ts 为后缀。ts 会解析项目中所有的 *.ts 文件,
// 假如仍然无法解析，那么可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件

// 第三方声明文件
// @types 统一管理第三方库的声明文件。 npm install @types/jquery --save-dev

// 书写声明文件:  当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了


//（10）内置对象

// (11) 泛型

interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']





