const pino = require('pino');
const logger = pino();

module.exports=(req,res,next)=>{
    logger.info({method:req.method,url:req.url},'req');
    res.on('finish',()=>{
        logger.info({method:req.method,url:req.url,status:res.statusCode},'res');
    });
    next();
};