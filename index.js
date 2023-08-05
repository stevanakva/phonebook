require('dotenv').config()
const Person = require('./models/person')

const { response } = require('express')
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'))


morgan.token("post", (request, _response) => {
  "use strict";
  if (request.method === "POST") return JSON.stringify(request.body);
  else return "";
});

morgan.format(
  "postFormat",
  ":method :url :status :res[content-length] - :response-time ms | :post"
);

app.use(morgan("postFormat"));





app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      response.json(persons);
    })
    .catch(error => next(error))
    
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((results) => {
      response.send(`<p>Phonebook has info for ${results} people.
      </p><p>${new Date()}</p>`)
    })  
    .catch(error => next(error));
  
});

app.get('/api/persons/:id', (request, response, next) =>{
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if(!body.name || !body.number){
    return response.status(400).json(
      {error:'name or number is missing'}
    );
  }

  // if(persons.map(p => p.name).includes(body.name)){
  //   return response.status(400).json(
  //     {error:'name must be unique'}
  //   );
  // }

  const person = new Person ({
    name: body.name,
    number: body.number,    
  })

  person.save()
   .then((savedPerson) => {
      response.json(savedPerson);
   })
   .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  "use strict";
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true
     })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'Malformatted'});
  }

  next(error);
}

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})
