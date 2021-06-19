const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rudransh:EhmzRvBXEPEYhPVT@cluster0.f5ieo.mongodb.net/creditManagementSystem?retryWrites=true&w=majority",{useNewUrlParser:true , useUnifiedTopology:true});



const userSchema ={
    _id: Number,
    name: String,
    email: String,
    credit: Number
}

const User=mongoose.model("User",userSchema);

const user1=new User({
    _id:1,
    name:"Tim",
    email:"timBuchalka@gmail.com",
    credit:1000
});

const user2=new User({
    _id:2,
    name:"Akshat",
    email:"andreNegoie@gmail.com",
    credit:1000
});

const user3=new User({
    _id:3,
    name:"Kishan",
    email:"AngelaYu@gmail.com",
    credit:1000
});

const user4=new User({
    _id:4,
    name:"Ishan",
    email:"JohnNicolas@gmail.com",
    credit:1000
});

const user5=new User({
    _id:5,
    name:"Chirag",
    email:"JohnBaurer@gmail.com",
    credit:1000
});

const user6=new User({
    _id:6,
    name:"Pratham ",
    email:"DavidWarner@gmail.com",
    credit:1000
});

const user7=new User({
    _id:7,
    name:"Sparsh",
    email:"NicolasPooran@gmail.com",
    credit:1000
});

const user8=new User({
    _id:8,
    name:"Utkarsh",
    email:"Tabrez786@gmail.com",
    credit:1000
});

const user9=new User({
    _id:9,
    name:"Manthan",
    email:"MatthewHayden@gmail.com",
    credit:1000
});

const user10=new User({
    _id:10,
    name:"Rishabh",
    email:"TheRock@gmail.com",
    credit:1000
});

const user11=new User({
    _id:11,
    name:"Rudransh",
    email:"Christian@gmail.com",
    credit:1000
});

const user12=new User({
    _id:12,
    name:"Test User ",
    email:"Styles@gmail.com",
    credit:1000
});


const defaultUsers =[user1,user2,user3,user4,user5,user6,user7,user8,user9,user10,user11,user12];

const transactionSchema ={
    sender : String,
    receiver : String,
    credits_Transfered : Number
};

const Transaction=mongoose.model("Transaction", transactionSchema);

app.get("/",function(req,res){
    res.render("index");
});

app.get("/user",function(req,res){
    console.log('ok');
    User.find({},function(err,foundUsers){
        // console.log(foundUsers);
        if(foundUsers.length===0){
            User.insertMany(defaultUsers,function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("successfully inserted document to the database");
                    }
                });
        }else{
        res.render("user", {userDetails:foundUsers});
        }
    });
    
});

app.get("/view:id",function(req,res){
    const customView=req.params.id;
    User.find({_id:customView},function(err,foundUsers){
        
        res.render("view",{userDetails:foundUsers});
     });

})

app.get("/view",function(req,res){
    res.render("view");
    
});

app.get("/successful",function(req,res){
    res.redirect("/successful");
})

app.get("/unsuccessful",function(req,res){
    res.redirect("/unsuccessful");
})

app.post("/transfercredits",function(req,res){
    const senders_id=req.body.sender_id;
    var receiverName=req.body.receiver_name;
    var creditAmount=Number(req.body.credit_amount);
    console.log('credit amt '+creditAmount);
    // let current_credit=0;

    User.find({name:receiverName},function(err,checkReceiverCredit){
        receiver_credit=checkReceiverCredit[0].credit;
    });
    
    
    User.find({_id:senders_id},function(err,checkCredits){
        current_credit=checkCredits[0].credit;
        
    
        if((checkCredits[0].credit > creditAmount) && (checkCredits[0].name != receiverName)){
            User.findOneAndUpdate({_id:senders_id},{$set:{credit:current_credit - creditAmount}},function(err){
                if(err){
                    console.log(err);
                    res.sendFile(__dirname + "/unsuccessful.html");
                }else{
                    User.findOneAndUpdate({name:receiverName},{$set:{credit:receiver_credit + creditAmount}},function(err){
                        if(err){
                            console.log(err);
                            res.sendFile(__dirname + "/unsuccessful.html");
        
                        }else{
                            console.log("document updated without any error");
                            res.sendFile(__dirname + "/successful.html");
                            let new_transaction = new Transaction({
        
                                sender:checkCredits[0].name,
                                receiver:receiverName,
                                credits_Transfered:creditAmount
                             });
                                    
                                new_transaction.save();
        
                        }
                    });
                }
            });
           
            
            
        }else{
            res.sendFile(__dirname + "/unsuccessful.html");
        }
    });




});

app.get("/transaction",function(req,res){
    Transaction.find({},function(err,foundTransaction){
        
        res.render("transaction",{foundTransaction:foundTransaction});
        
    });
});

app.listen(PORT,function(){
console.log("server is running on port 3000");
});


