const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


const userSchema = new mongoose.Schema({
    email:{type:String,
    required:true
} ,
    password: {type:String,
        required:true
    },
    repeatPassword: {type:String,
        required:true
    },
});


const users=new mongoose.model('users',userSchema);

module.exports=users;