const mongoose =require('mongoose')
const dotenv=require('dotenv')

dotenv.config()
const mongoURL=process.env.mongoURI
console.log(process.env)

const connectDB= async ()=>{
    try{
       mongoose.connect(mongoURL,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true, useFindAndModify: false})
       console.log('Database connected')
    }catch(error){
        console.log(error.message)
        process.exit()
    }
}
 
module.exports=connectDB