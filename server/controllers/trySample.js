//trySample.js
/*
    this file is for testing the nodejs and koa interface
*/

module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  await next();
  //response type
  ctx.response.type='text/html';
  //responce body
  ctx.response.body='this is try page';
}
