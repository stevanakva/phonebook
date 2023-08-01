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

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  : 0;
  return (maxId + Math.floor(Math.random()*10000) + 1);
}

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) =>{
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if(person){
    response.json(person);
  } else {
    response.status(404).end();
  }  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name || !body.number){
    return response.status(400).json(
      {error:'name or number is missing'}
    );
  }

  if(persons.map(p => p.name).includes(body.name)){
    return response.status(400).json(
      {error:'name must be unique'}
    );
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person);
  
  response.json(person);

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})
