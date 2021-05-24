const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const configUtil = require('./configUtil.js');
const envConfig = require('./envConfig.js');
const projectConfig = require('./project.config');

const definePlugin = (option = {})=>{
  return new webpack.DefinePlugin(configUtil.formatDefine(option));
}
const HashedModuleIdsPlugin = new webpack.HashedModuleIdsPlugin()

// server static path
// const ServerStaticPath = configUtil.pathPwd('../server/src/assets/static/static');
const ServerStaticPath = '';
const config = baseConfig({
  output:{
    path:ServerStaticPath || configUtil.pathPwd('dist/static'),
    publicPath:"./static/"
  },
  filenameFormat:"../$name.html",
  mode:"development",
  useAnalyzer:true,
});
config.plugins.unshift(new webpack.DefinePlugin({
  NODE_ENV:JSON.stringify('dev')
}));
module.exports = (env)=>{
  config.plugins.unshift(
    definePlugin(envConfig[env.NODE_ENV] || {}),
    HashedModuleIdsPlugin
  );
  console.log(env.NODE_ENV,definePlugin(envConfig[env.NODE_ENV] || {}));
  return config;
}