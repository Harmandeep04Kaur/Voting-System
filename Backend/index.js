const express=require("express");
const app= express();
require('dotenv').config();

const cors=require("cors");
const { mongoose } = require("mongoose");

const poll = require("./routes/pollauth");
const auth= require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/polls', poll);

mongoose.connect("mongodb+srv://HarmandeepKaur:har24noor@cluster0.7so7fhk.mongodb.net/InfoDB?retryWrites=true&w=majority")
.then(()=>{
    console.log("DB Connected !")

})
.catch(err=>{
    console.log(err)
})


app.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
});