const koaResponseTime = async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = +new Date() - +start;
  // eslint-disable-next-line no-console
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
};

export default koaResponseTime;
