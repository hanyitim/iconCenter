#### 项目运行
* 本地开发：npm run start
* 打包: npm run build:dev (dev || pre || prod)

注意：
1. webpack 是有加上BundleAnalyzerPlugin的，可以访问http://127.0.0.1:8889 去查看打包文件的资源依赖情况以及依赖的大小。
2. eruda 调试工具；开发、预发环境默认打开

#### Q&A
* 因为需要操作iframe，注入jsb，所以，该项目的资源必须放到act.pparty.com 下面，跟活动页面同域
* 包裹tab模块，除了第一个tab，其他的都需要在xbird上面配置，格式是 ```key-tabName-url```;且url需要页面是同个域名
