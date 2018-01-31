const express = require('express');
const queryString = require('query-string');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));
app.use(gateKeeper);

const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  // ...other users
];

function gateKeeper(req, res, next) {
  // This function should get the string value sent for the request header 'x-username-and-password'.
  // You can use the req.get('x-username-and-password') to retrieve the header value.
  const headerCredentials = req.get('x-username-and-password');
    
  // Use queryString to parse the values for user and pass from the request header. 
  // Specifically, use the queryString.parse method, which is designed for parsing URL query params. 
  // For instance, queryString.parse('catName=george&dogName=georgette') would produce {catName: 'george', dogName: 'georgette'}.
  if(headerCredentials) {
    const userCredentials = queryString.parse(headerCredentials);
    console.log('userCredentials', userCredentials);
    
    // Check the user credentials against the USERS, array. You'll probably want to use the .find array method for this.
    const userIndex = USERS.findIndex(user => user.userName === userCredentials.user);
    
    if(userIndex !== -1) {
      console.log('userIndex', userIndex);
      console.log(`USERS[${userIndex}]`, USERS[userIndex]);
      // compare password for user to fully verify user
      console.log(`USERS[${userIndex}].password`, USERS[userIndex].password);
      console.log('userCredentials.password', userCredentials.pass);
      if(USERS[userIndex].password === userCredentials.pass) {
        // If a matching user is found, set req.user to that user.
        req.user = USERS[userIndex];
      }
      console.log('req.user', req.user);
    }
  }
  
  
  
  // Otherwise, req.user should be either null or undefined. 
  // Note that you should never explicitly set a value to undefined, 
  // but depending on your implementation, req.user might end up being undefined.
 
  next();
}

app.get("/api/users/me", (req, res) => {
  console.log('app.get route req.user', req.user);
  if (req.user === undefined) {
    return res.status(401).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
