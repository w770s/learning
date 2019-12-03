// 封装MongoDB 库之前的一些准备操作 es5，es6，class 类，静态方法，以及单例模式



// 1. 原生js中类，静态方法和继承

// 一般 构造函数和原型链是一起使用的， 一个保护私有变量， 一个更快，所有实力都能访问
// function Person(name,age) {
//     // 构造函数上面的方法属性： 会在它的每一个实例上都克隆这个方法，般是因为我们需要访问构造函数内部的私有变量 .
//     this.name = name
//     this.age = age
//     this.run = function () {
//         console.log(`${this.name}` + '--' + `${this.age}`);
//     }
// }
// // 原型链上面的方法属性： 可以被多个实例共享，但是不会在每个实例的内部重新定义这个方法，
// // 如果我们的应用需要创建很多新的对象,并且这些对象还有许多的方法,为了节省内存,
// // 注意点：如果你改变某个方法,那么由这个构造函数产生的所有对象的那个方法都会被改变，变量提升
// // 对象序列化：prototype 上的属性不会被序列化
// Person.prototype.sex = 'boy'
// Person.prototype.work = function () {
//     console.log(`${this.name}` + '--' + `${this.age}`+ '--' + `${this.sex}`);
// }
//
// // 在es5 中 原型链和构造函数上的方法都是实例的方法 ，要使用的话需要想实例化类 new
//
//
// // 静态方法： 直接绑定到实例上
// Person.setName = function () {
//     console.log('静态方法')
// }
//
// const person1 = new Person('xla','22')
// console.log(JSON.stringify(person1));
// // {"name":"xla","age":"22"} 没有 sex  // 对象序列化：prototype 上的属性不会被序列化
//
// person1.run()
// person1.work()
//
// Person.setName()
// 执行静态方法


// es5 继承
// function Person(name,age) {
//     this.name = name
//     this.age = age
//     this.run = function () {
//         console.log(`${this.name}` + '--' + `${this.age}`);
//     }
// }
//
// Person.prototype.setName = function () {
//     console.log(this.name, this.age);
// }

// function Inheritance(name,age) { // 1。借用构造函数继承,对象冒充实现继承，无法复用（原型链上的无法继承）
//     console.log(this); // {}
//     Person.call(this,name,age) // 把上下文的this,绑定到相关函数上
//     console.log(this); // Inheritance { name: 'xla', age: 22, run: [Function] }
// }
//
// const a = new Inheritance('xla',22)


// function Inheritance(name,age){
//     Person.call(this,name,age)
// }

// Inheritance.prototype = new Person()  // 3 原型链继承 + 构造函数继承 + 组合，
// 优点（解决的问题）： 1.可以实现原型链的继承， 2.子类可以给父类传值
// 缺点： 生成了两个实例： 一个父类，一个子类

// Inheritance.prototype = Object.create(Person.prototype); // 4。 完美（寄生组合）： 解决了，生成两个实例
// Inheritance.prototype.constructor  = Inheritance; //Person  创建的对象是使用哪个构造器就用哪个！但是一般继承后都是用自己的构造器！
//
// const  a = new Inheritance('xla', 2) // 2。单独的原型链继承， 实例化子类是无法给父类传参， 一修改全部修改
//
// console.log(a);


// 4。原型式继承， 寄生式继承， 寄生组合式继承（推荐）

// console.log(a);


// 2. es6中类，静态方法和继承

// class Person{  // es6中类，属性方法
//     constructor(name,age){ // 构造函数实例化是执行
//         this.name = name
//         this.age = age
//     }
//     getName(){
//         console.log(this.name);
//     }
//     getAge(){
//         console.log(this.age);
//     }
// }


// es6继承
//
// class Web extends Person{
//     constructor(name,age,sex){
//         super(name,age) // 实例化子类的时候把子类的数据传给父类
//         this.sex = sex // 自己的属性
//     }
//
//     print(){
//         console.log(this.name,this.age,this.sex);
//     }
//
// }
//
//
// const a = new Web('xla',12, 'boy')
//
//
// a.getName()
// a.getAge()
// a.print()


// es6 静态方法

// class Person{
//     constructor(name) {
//         this.name = name
//     }
//     run(){ // 实例方法
//         console.log(this.name);
//     }
//     static work(){
//         // this.name === 构造函数的名字
//         console.log(this.name+'q23112');
//     }
// }
// Person.es5Static = function () {
//     console.log('es5静态方法');
// }
//
//
// const a = new Person('xla')
//
// a.run()
//
// Person.work()
// Person.es5Static()
//



// 3.es6 中单例模式: 无论实例化多少次，构造函数只执行一次

// class Db{
//     static GetInstance(){
//         if(!Db.instance){ // 价格判断
//             Db.instance = new Db()
//         }
//         return Db.instance
//     }
//     constructor(name){
//         this.name = name
//         this.getName()
//     }
//     getName(){
//         console.log('实例化开始');
//     }
//     endName(){
//         console.log('实例化结束');
//     }
// }
//
// // const a = new Db('A')
// // const b = new Db('B')
//
// Db.GetInstance()
// Db.GetInstance()
// Db.GetInstance()





