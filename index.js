const express = require('express')
const app = express()

app.use(express.json())

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

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })