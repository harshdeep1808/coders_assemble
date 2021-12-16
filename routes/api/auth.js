const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const {check,validationResult}=require('express-validator')
const dotenv=require('dotenv')

dotenv.config()

const auth=require('../../middleware/auth')
const User=require('../../models/Users')

const router=express.Router()

router.get('/',auth,async(req,res)=> {
 try{
        const user=await User.findById(req.user.id).select('-password')   //.select will remove password
        res.json(user)
 }catch(error){
          res.status(500).send('server error')
 }
})

                          //LOGIN USER
router.post('/',[
    check('email','Email is required').isEmail(),
    check('password','Enter Password').exists()
],async (req,res)=> {

    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
     const {email,password}=req.body
    try{
               //check if user already exists  

       const user=await User.findOne({email}); 
       if(!user){
           return res.status(400).json({errors:[{msg:'User doesnt  exist'}]})
       }

         const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid credentials'}]})
        }

       //return jsonwebtoken
       const payload={
        user:{
            id:user.id
        }
    }
    jwt.sign(
       payload,
       process.env.jwtSecret,
       {expiresIn:36000},
       (err,token)=>{
            if(err)
            throw err
            res.json({token})
       })

    }catch( error)
    {    res.status(500)
         console.log('Server error in auth')    
    }
})


module.exports=router