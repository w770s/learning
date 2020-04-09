git pull
#打包
yarn run build
#前缀
prefix="harbor.asoco.com.cn/waste/"
#版本号
version="v0.0.18-beta1"
#编译
docker  build -t $prefix"danger-waste-good-view:"$version .
#登录
docker login --username=whp --password=Abc.123456  harbor.asoco.com.cn
#上传
docker push $prefix"danger-waste-good-view:"$version
docker rmi $prefix"danger-waste-good-view:"$version
#docker system prune -f

#ssh root@120.78.95.201 "cd /home/waste;sh build.sh"
