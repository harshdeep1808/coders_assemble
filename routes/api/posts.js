const express=require('express')
const {check,validationResult}=require('express-validator')

const auth=require('../../middleware/auth')
const User=require('../../models/Users.js')
const Profile=require('../../models/Profile.js')
const Post=require('../../models/Post.js')
const dotenv=require('dotenv')

dotenv.config()

const router=express.Router()

                             //GET  posts
router.get('/',auth,async (req,res)=>{
    try{
            const post =await Post.find().sort({date:-1}) //.sort sorts the arry with most recent as first  
    }catch(error){
        console.log(error.message)
        res.status(500).send('Server error')
    }

})

                             //POST posts
router.post('/',[auth,
    check('text','Please enter text').not().isEmpty()
],async(req,res)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()})
        }

        try{
               const user=await User.findById(req.user.id).select('-password')
               if(!user){
                   return res.status(404).json({msg:'User not found'})
               }
               console.log(user)
               const newPost=new Post({
                   text:req.body.text,
                   name:user.name,
                   avatar:user.avatar,
                   user:req.user.id
               })

            const post=await newPost.save()
            res.json(post)

        } catch(error){
            console.log(error.message)
            res.status(500).send('Server error')
        }

})
                 //GET posts by id
router.get('/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      res.json(post);
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });

                 //DELETE posts by iD
                 router.delete('/:id', auth, async (req, res) => {
                    try {
                      const post = await Post.findById(req.params.id);
                  
                      if (post.user.toString()!=req.user.id) {
                        return res.status(404).json({ msg: 'User not authorized' });
                      }
                  
                      await post.remove()
                      res.json({msg:'Post removed'})
                    } catch (err) {
                      console.error(err.message);
                  
                      res.status(500).send('Server Error');
                    }
                  });

                  //ADD like on post
    router.put('/likes/:id',auth,async (req,res)=>{
         const post=await Post.findById(req.params.id)
         try{
                         //check if post already liked
                if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                    return res.status(404).json({ msg: 'Post already liked' });
                }

                post.likes.unshift({user:req.user.id})
                await post.save()

                res.json(post.likes)
         }catch(error){
            console.error(err.message);                  
            res.status(500).send('Server Error');
         }
    })
                  //REMOVE a like on post
                  router.put('/unlike/:id',auth,async (req,res)=>{
                    const post=await Post.findById(req.params.id)
                    try{
                                    //check if post already liked
                           if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                               return res.status(404).json({ msg: 'Post not liked' });
                           }
           
                           const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
                           post.likes.splice(removeIndex,1)
                           await post.save()
           
                           res.json(post.likes)
                    }catch(error){
                       console.error(err.message);                  
                       res.status(500).send('Server Error');
                    }
               })   
               
                                        //ADD comment
               router.post('/comment/:id',[auth,
                check('text','Please enter text').not().isEmpty()
            ],async(req,res)=>{
                    const errors=validationResult(req)
                    if(!errors.isEmpty()){
                        res.status(400).json({errors:errors.array()})
                    }
            
                    try{
                           const user=await User.findById(req.user.id).select('-password')
                           const post=await Post.findById(req.params.id)
                           
                           const newComment={
                               text:req.body.text,
                               name:user.name,
                               avatar:user.avatar,
                               user:req.user.id
                           }
                        post.comments.unshift(newComment)
                        await newPost.save()
                        res.json(post.comments)
            
                    } catch(error){
                        console.log(error.message)
                        res.status(500).send('Server error')
                    }
            
            })          
            
            //DELETE comment
    router.delete('/:id/:comment_id',auth,async (req,res)=>{
           try{
                const post=await Post.findById(req.params.id)

                const comment=post.comments.find(comment=>comment.id===req.params.comment_id)

                if(!comment){
                   return res.status(404).json({msg:'No comment found'})
                }

                if(comment.user.toString()!=req.user.id){
                    return res.status(400).json({msg:'User Not Authorized'})
                }
               
                const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id)
                post.comments.splice(removeIndex,1)
                await post.save()

                res.json(post.comments)

           }catch(error){
            console.log(error.message)
            res.status(500).send('Server error')
           }
    })

module.exports=router