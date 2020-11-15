const router = require('koa-router')();
const koaSend = require('koa-send');
const path = require('path');
const { generateWordFile } = require('./word/index');
router.post(`/generate`, async ctx => {
    const body = ctx.request.body;
    const params  = {
        ...body,
        hole: body.CurrentSelectHole.hole,
        specificSurfaceArea: body.CurrentSelectHole.specificSurfaceArea,
        openHoleRatio: body.CurrentSelectHole.openHoleRatio,
        outWallThickness: body.CurrentSelectHole.outWallThickness
    }
    await generateWordFile(params);
    ctx.body = {
        status: 'Success',
        data: {}
    };
})

router.get(`/download`, async ctx => {
    ctx.attachment('static/out.docx');
    await koaSend(ctx, 'static/out.docx');
})

module.exports = router;