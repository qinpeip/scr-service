const router = require('koa-router')();
const { UserModel } = require('../sql');
const { loginFaild } = require('../ErrorCode');
router.get('/info', async ctx => {
  if (ctx.isAuthenticated()) {
    const user = ctx.state.user;
    delete user.password;
    ctx.body = {
      user: user,
      status: 'Success'
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
});

const getUserList = async ({page, pageSize, phone}) => {
  return new Promise(async (resolve, reject) => {
    const query = {};
    phone && (query.phone = phone);
    const count = await UserModel.countDocuments(query);
    UserModel.find(query, {password: 0}).skip((page -1) * pageSize).limit(+pageSize).then((data) => {
      resolve({
        data,
        total: count
      });
    }).catch(err => reject(err));
  })
};
router.get('/list', async ctx => {
  if (ctx.isAuthenticated()) {
    const query = ctx.request.query;
    const data = await getUserList(query);
    ctx.body = {
      status: 'Success',
      code: loginFaild,
      data
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
});

const addUser = async(params) => {
  return new Promise(async (resolve, reject) => {
    const lastUser = await UserModel.find({}).sort({id: -1}).limit(1);
    const id = lastUser[0] ? lastUser[0].id + 1: 1;
    const user = new UserModel({
      username: params.username,
      password: params.password,
      phone: params.phone,
      age: params.age,
      gender: params.gender,
      id: id,
      createAt: Date.now()
    });
    const data = await user.save();
    resolve(data);
  });
};
router.post('/add', async ctx => {
  if (ctx.isAuthenticated()) {
    const query = ctx.request.body;
    const data = await addUser(query);
    ctx.body = {
      status: 'Success',
      data
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
});
const editUser = async (params) => {
  return new Promise(async (resolve, reject) => {
    const query = {
      username: params.username,
      password: params.password,
      phone: params.phone,
      age: params.age,
      gender: params.gender,
      updateAt: Date.now()
    };
    const data = await UserModel.findOneAndUpdate({id: params.id}, query);
    resolve(data);
  });
};
router.post('/edit', async ctx => {
  if (ctx.isAuthenticated()) {
    const query = ctx.request.body;
    const data = await editUser(query);
    ctx.body = {
      status: 'Success',
      data
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
});
router.get('/delete/:id',async ctx => {
  if (ctx.isAuthenticated()) {
    const {id = ''} = ctx.params;
    const data = await UserModel.remove({id});
    ctx.body = {
      status: 'Success',
      data
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
})
router.get('/username/:username', async ctx => {
  if (ctx.isAuthenticated()) {
    const { username = '' } = ctx.params;
    const findData = await UserModel.findOne({username}, {password: 0});
    ctx.body = {
      status: 'Success',
      data: findData
    }
  } else {
    ctx.body = {
      status: 'Error',
      code: loginFaild,
      message: '用户登录已失效'
    }
  }
});
module.exports = router;