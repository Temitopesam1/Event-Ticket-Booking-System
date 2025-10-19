require('dotenv').config(); 
const app = require('./app'); 
const { sequelize } = require('./models'); 
const PORT = process.env.PORT || 3000; 

(async ()=>{ 
  try{ 
    await sequelize.authenticate(); 
    console.log('DB connected'); 
    await sequelize.sync();
    if (process.env.DEMO_MODE === 'true' || process.env.DEMO_MODE === '1') {
      try { 
        require('./scripts/initDemo'); 
      } catch(e){ 
        console.error('Demo init failed', e); 
      }
    }
    app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`)); 
  }catch(err){ 
    console.error('Startup failed', err); 
    process.exit(1); 
  } 
})();
