const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

// Tehdään uusi token morganin skriptiä varten
morgan.token('body', request => {
  return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2"
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3"
  },
  {
    name: "Merja Pallas",
    number: "060-453573435",
    id: "4"
  }
]

 


  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/info', (request, response) => {
    response.send(`<div>Catalogue has ${persons.length} persons 
    <br/><br/>
    ${new Date()}</div>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personToshow = persons.find(person => {
      return person.id === id
    })
    if (personToshow) {
      console.log(personToshow)
    response.json(personToshow)  
    } else {
      console.log("Person not found with id ", id)
        response.status(404).end()
    } 
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log("ID TO DELETE", id)
    const personToDelete = persons.find(person => {
      return person.id === id
    })


    if (personToDelete){
      console.log("deleting", personToDelete)
      persons = persons.filter(person => person.id !== id)
      response.status(204).end()
    } else {
      console.log("Person not found with id ", id)
      response.status(404).end()
    } 
    
  })

  const getRandomInt = (max) =>  {
    return Math.floor(Math.random() * max);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'missing person name' 
      })
    } else if (!body.number) {
      return response.status(400).json({ 
        error: 'missing person number' 
      })
    }

    const samePerson = persons.find(person => {
      return person.name === body.name
    })

    if (!!samePerson) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: getRandomInt(1000000)
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })