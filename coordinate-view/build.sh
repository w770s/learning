git pull
#打包
yarn run build
#前缀
prefix="harbor.asoco.com.cn/whp/"
#版本号
version="v2.0.4-beta2"
#编译
docker  build -t $prefix"coordinate-view:"$version .
#登录
docker login --username=whp --password=Abc.123456  harbor.asoco.com.cn
#上传
docker push $prefix"coordinate-view:"$version
docker rmi $prefix"coordinate-view:"$version
docker system prune -f

