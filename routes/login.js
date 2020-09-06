const router = require('koa-router')();
const passport = require('../auth/passport_config'); 
const { otherError } = require('../ErrorCode');
router.post('/', async function (ctx, next) {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.body = {
        user,
        status: 'Success'
      };
      return ctx.login(user);
    } else {
      ctx.body = {
        status: 'Error',
        code: otherError,
        message: info
      }
    }
  })(ctx, next);
});

router.get('/logout', async ctx => {
  ctx.logout();
  ctx.body = {
    status: 'Success',
    message: '退出成功'
  };
})


module.exports = router;

