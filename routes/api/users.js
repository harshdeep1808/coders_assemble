const express=require('express')
const router=express.Router()
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const {check,validationResult}=require('express-validator')

const User=require('../../models/Users')
                         
                        //CREATE user
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Email is required').isEmail(),
    check('password','Password should be at least 6 characters').isLength({min:6})
],async (req,res)=> {

    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
     const {name,email,password}=req.body
    try{
               //check if user already exists  

       const user=await User.findOne({email}); 
       if(user){
           return res.status(400).json({errors:[{msg:'User already exists'}]})
       }
               //get users gravatar

     const avatar=gravatar.url(email,{
         s:'200', //size
         r:'pg', //r means rating ..pg means pg rated images for kids only
         d:'mm'   //d means default image
     })
      const newUser=new User({
          name,
          email,
          avatar,
          password
      });  
              //bcrypt password
      const salt=await bcrypt.genSalt(10)
      
     newUser.password=await bcrypt.hash(password,salt) 
    
      await newUser.save()
            
       //return jsonwebtoken
       const payload={
        user:{
            id:newUser.id
        }
    }
    jwt.sign(
       payload,
       config.get('jwtSecret'),
       {expiresIn:36000},
       (err,token)=>{
            if(err)
            throw err
            res.json({token})
       })

    }catch( error)
    {    res.status(500)
         console.log('Server error')    
    }
})

module.exports=router