main(){
  String str = 'asq21';
  int num = 1231231;
  var a = '12312';// 自动类型推断为string ,不可变为其他类型
  // const car = new DateTime.now(); // 只能为常量表达式 ，这里错误
  final car = new DateTime.now(); // final 和 const 都是定义常量，也能为常量表达式 
  print(car);
}