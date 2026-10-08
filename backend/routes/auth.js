const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

function token(u){return jwt.sign({id:u._id},process.env.JWT_SECRET,{expiresIn:'7d'})}
function safe(u){return {id:u._id,name:u.name,email:u.email,role:u.role}}

router.post('/register',async(req,res)=>{try{
 const name=String(req.body.name||'').trim();
 const email=String(req.body.email||'').trim().toLowerCase();
 const password=String(req.body.password||'');
 if(!name||!email||!password)return res.status(400).json({message:'Please fill in all fields.'});
 if(password.length<6)return res.status(400).json({message:'Password must be at least 6 characters.'});
 if(await User.findOne({email}))return res.status(409).json({message:'An account with this email already exists.'});
 const u=await User.create({name,email,password:await bcrypt.hash(password,10),role:'user'});
 res.status(201).json({token:token(u),user:safe(u)});
}catch(e){res.status(500).json({message:'Registration failed.'})}});

router.post('/login',async(req,res)=>{try{
 const email=String(req.body.email||'').trim().toLowerCase();
 const password=String(req.body.password||'');
 const u=await User.findOne({email});
 if(!u||!(await bcrypt.compare(password,u.password)))return res.status(401).json({message:'Incorrect email or password.'});
 res.json({token:token(u),user:safe(u)});
}catch(e){res.status(500).json({message:'Login failed.'})}});

// Dedicated admin login. If the admin account does not exist yet, create it from .env.
router.post('/admin-login',async(req,res)=>{try{
 const email=String(req.body.email||'').trim().toLowerCase();
 const password=String(req.body.password||'');
 const adminEmail=String(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
 const adminPassword=String(process.env.ADMIN_PASSWORD||'');
 if(!adminEmail||!adminPassword||email!==adminEmail||password!==adminPassword){
   return res.status(401).json({message:'Invalid administrator email or password.'});
 }
 let u=await User.findOne({email:adminEmail});
 if(!u){
   u=await User.create({name:'Administrator',email:adminEmail,password:await bcrypt.hash(adminPassword,10),role:'admin'});
 }else if(u.role!=='admin'){
   u.role='admin';
   u.password=await bcrypt.hash(adminPassword,10);
   await u.save();
 }
 res.json({token:token(u),user:safe(u)});
}catch(e){res.status(500).json({message:'Admin login failed.'})}});

router.get('/me',require('../middleware/auth').auth,(req,res)=>res.json({user:safe(req.user)}));
module.exports=router;
