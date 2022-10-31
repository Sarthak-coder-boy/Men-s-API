
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { getEventListeners } = require("events");

const app = express();

app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/olympicsDB");

const menSchema = new mongoose.Schema({
    rankings:{
        type:Number,
        required:true,
        unique:true,
       
    },
   name:{
        type:String,
        required:true,
        trim:true
    },
  
   country:{
        type:String,
        required:true,
        trim:true
    },
   score:{
        type:Number,
        required:true,
        trim:true
    },
   event:{
        type:String,
      default:"100m"
    }

});

const MenRanking =  new mongoose.model("MenRanking" , menSchema);


// Requesting for all entries
app.route("/mens")

.get((req,res)=>{

    MenRanking.find((err,foundranks)=>{
        if(err){
        res.send(err)
        }
        else{
        res.send(foundranks)
        }
        
    }).sort({"ranking":1});
})


.post((req,res)=>{

    const menrank = new MenRanking(req.body);
    menrank.save((err)=>{
        if(!err){
            res.send("Successfully added Ranking")
        }
        else{
            console.log(err)
        }
    });

})





//Requesting according to ranks
app.route("/mens/:rank")

.get((req,res)=>{
 
    MenRanking.findOne({rankings:req.params.rank}, function(err,foundrunner){
    if(foundrunner){
res.send(foundrunner)
}
else
{
  res.send("No runner matched")
}
  })
})

//put will only update score and if changes made other than score then error will be given
.put((req,res)=>{

    MenRanking.updateOne(
        {rankings:req.params.rank},
        {score:req.body.score},
        (err)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send("Updated Successfully")
            }
        }
        )
})


//patch will update all the changes that user does but put will only update the given changes
.patch((req,res)=>{

    MenRanking.updateOne(
        {rankings:req.params.rank},
        {$set:req.body},
        (err)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send("Updated Successfully")
            }
        }
        )
})

.delete((req,res)=>{

    MenRanking.deleteOne(
        {rankings:req.params.rank},
        (err)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send("Deleted Successfully")
            }
        }
        )
})


app.listen(3000,()=>{
    console.log("Server Started Successfully")
})