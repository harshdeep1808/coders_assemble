const mongoose =require('mongoose')

const config=require('config')
const mongoURL=config.get('mongoURI')

const connectDB= async ()=>{
    try{
       mongoose.connect(mongoURL,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true, useFindAndModify: false})
       console.log('Database connected')
    }catch(error){
        console.log(error.message)
        process.exit(1)
    }
}
 
module.exports=connectDB