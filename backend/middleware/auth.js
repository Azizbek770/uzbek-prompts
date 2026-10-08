const jwt=require('jsonwebtoken');
const User=require('../models/User');
async function auth(req,res,next){
 try{
  const header=req.headers.authorization||'';
  if(!header.startsWith('Bearer '))return res.status(401).json({message:'Authentication required.'});
  const payload=jwt.verify(header.slice(7),process.env.JWT_SECRET);
  const user=await User.findById(payload.id);
  if(!user)return res.status(401).json({message:'User not found.'});
  req.user=user;next();
 }catch(e){return res.status(401).json({message:'Your session has expired. Please log in again.'})}
}
function admin(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Administrator access required.'});next()}
module.exports={auth,admin};
