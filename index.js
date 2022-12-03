const { response } = require("express");
const express = require ("express")
const app = express()
app.use(express.json())
const morgan = require('morgan');

morgan.token("body",(request,response) => 
    request.method === "POST" ? JSON.stringify(request.body) : ""
)
app.use(
    morgan((tokens, request, response) =>
        [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        tokens.body(request,response)
        ].join(' ')
    )
)

let persons = [
    {   
        "id": 1,
        "name" : "martina",
        "number" : "040-123456"
    },
    {   
        "id": 2,
        "name" : "matias",
        "number" : "012-123456"
    },
    {   
        "id": 3,
        "name" : "marcos",
        "number" : "123-123456"
    },
    {   
        "id": 4,
        "name" : "mateo",
        "number" : "541-123456"
    },
    {   
        "id": 5,
        "name" : "marcelo",
        "number" : "652-123456"
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id",(request,response) => {
    const id = Number(request.params.id)
    const persona = persons.find(p => p.id === id)
    if(persona){
        response.json(persona)
    }else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id",(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post("/api/persons",(request,response) => {
    const persona = request.body

    //esta funcion devuelve undefined si ningun elemento se repite
    const buscadorDeRepetidos = persons.find(p => p.name === persona.name)

    //si falta el nombre el numero o si se repite el nombre tira error
    if (!persona.name || !persona.number || buscadorDeRepetidos !== undefined) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
     }

    let identificadores = persons.map(p => p.id)
    let majorId = Math.max(...identificadores)

    const nuevaPersona = {
        "id" : majorId + 1,
        "name" : persona.name,
        "number" : persona.number
    }
    persons = persons.concat(nuevaPersona)
    morgan.token()
    response.json(nuevaPersona)
})



let cantidadUsuarios = persons.length

app.get("/api/info",(request,response) => {
    response.send(`<div>
        <h2>La agenda tiene ${cantidadUsuarios} usuarios</h3>
        <p>${new Date()}</p>
    </div>`)
})


const PORT = 8008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})