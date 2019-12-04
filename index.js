const express = require('express');
const app = express();
var mongoose = require('mongoose');


//databas connectivity statement
mongoose.connect('mongodb://localhost:27017/myfirstmongodb', {useNewUrlParser: true,useUnifiedTopology:true});

//welcome home page 
app.get('/', (req, res) => { 
  res.send('Welcome to my Node.js app');
});


// route of /students 
app.get('/students', (req, res) => { 

  const listOfStudents = [
    {id: 1,name: 'Idrees'},
    {id: 2,name: 'Arif'},
    {id: 3,name: 'Asad'},
  ]

  res.send(listOfStudents);
});


//student Model 
const Student = mongoose.model('Student', {
    name: String,
    student_id: Number,
    email: String,
    password: String,
    date_added: Date
   });

   
// body-parser middleware
   const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//entering data into DB
app.post('/signup', async (req, res) => {
    const body = req.body;
    console.log('req.body', body)
      try{
    const student = new Student(body);
    
    const result = await student.save();
    res.send({
      message: 'Student signup successful'
    });
  
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error'}).status(401);
      };
});


//retrieval of data from DB 
app.get('/students', async (req, res) => {

  const allStudents = await Student.find();
  console.log('allStudents', allStudents);

  res.send(allStudents);
});


//for other then specified urls
app.get('*', (req, res) => { 
  res.send('Page Doesnot exists');
});


//log 
app.listen(3000, () => {
    console.log('Express application running on localhost:3000');

});

// Login Code
app.post('/login',  async (req, res) => {
  const body = req.body;
  console.log('req.body', body);

  const email = body.email;

  // lets check if email exists

  const result = await Student.findOne({"email":  email});
  if(!result) // this means result is null
  {
    res.status(401).send({
      Error: 'This user doesnot exists. Please signup first'
     });
  }
  else{
    // email did exist
    // so lets match password

    if(body.password === result.password){

      // great, allow this user access

      console.log('match');

      res.send({message: 'Successfully Logged in'});
    }

      else{

        console.log('password doesnot match');

        res.status(401).send({message: 'Wrong email or Password'});
      };
    };
  });