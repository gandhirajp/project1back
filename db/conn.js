const mongoose= require('mongoose');

const db= process.env.DATABASE;

mongoose.connect(db,{
    useNewUrlParser :true,
    useUnifiedTopology :true
}).then(()=>{
    console.log("Connection Succesful");
}).catch((e)=>{ 
    console.log(e);
})

// const db= process.env.DATABASE; 
// mongoose.connect(db, { 
//     useNewUrlParser : true, 
//     useUnifiedTopology : true
// }, err => {
//     if(err) throw err;
//     console.log("database connected successfully")
// })
