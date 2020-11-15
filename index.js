const Koa = require('koa2');
const router = require('./routes');
const koaBody = require('koa-body');
const path = require('path');
const session = require('koa-session2');
const passport = require('./auth/passport_config');
const mongoose = require('mongoose');
const static = require('koa-static');
const sqlUrl = 'mongodb://feisha:a741323823@localhost/scr';
// const sqlUrl = 'mongodb://localhost/scr';
mongoose.connect(sqlUrl, {useNewUrlParser: true,
useUnifiedTopology:true, useFindAndModify: true}, err => {
  if (err) {
    console.log('数据库连接失败:', err);
    return;
  } else {
    console.log('数据库连接成功');
  }
});

const cors = require('koa2-cors');
const app = new Koa();

app.proxy = true;
app.use(cors({
  origin: ctx => ctx.headers.origin,
  credentials: true
}))
app.use(static(`./www`))
app.use(session({key: 'SESSIONID', maxAge: 24*60*60*1000}));
app.use(koaBody({
  multipart: true,
  formidable: {
    // 上传目录
    uploadDir: path.join(__dirname, './static'),
    // 保留文件扩展名
    keepExtensions: true,
  }
}));
app.use(passport.initialize()).use(passport.session())
app.use(router.routes()).use(router.allowedMethods());
// app.listen(8000, () => {
//   console.log('server in runing 8000')
// });
app.listen(80);