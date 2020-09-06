const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const { UserModel } = require('../sql');

const findUser = async (username) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({username}, (err, data) => {
      if (err) {
        resolve(false);
      } else {
        resolve(data);
      }
    });
  });
};

passport.use(new LocalStrategy(
  /**
   * username 用户名称
   * password 用户密码
   * done 验证完成后的回调
   */
  async function(username, password, done) {
    const data =  await findUser(username);
    if (data) {
      if (data.username === username && data.password === password) {
        return done(null, data);
      } else {
        return done(null, false, '账号或密码错误');
      }
    } else {
      return done(null, false, '用户不存在');
    }
  }
))

// serializeUser 用户登录成功后会存储用户数据到session中

passport.serializeUser(function (user, done) {
  done(null, user);
})

passport.deserializeUser(function (user, done) {
  return done(null, user);
})

module.exports = passport;