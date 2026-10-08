require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const path=require('path');
const app=express();
app.use(cors());
app.use(express.json({limit:'1mb'}));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/prompts',require('./routes/prompts'));
app.use('/api/admin',require('./routes/admin'));
app.use(express.static(path.join(__dirname,'..','frontend')));
app.use('/admin',express.static(path.join(__dirname,'..','admin')));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'..','frontend','index.html')));
const port=process.env.PORT||5000;
if(!process.env.MONGODB_URI){console.error('MONGODB_URI .env faylida topilmadi.');process.exit(1)}
mongoose.connect(process.env.MONGODB_URI)
 .then(()=>app.listen(port,()=>console.log(`Uzbek Promts: http://localhost:${port}`)))
 .catch(err=>{console.error('MongoDB ulanish xatosi:',err.message);process.exit(1)});
