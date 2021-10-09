
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Academica',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express.',
    contact: {
      name: 'VaskaDaGama',
      url: 'https://github.com/VaskoDeGama/academica'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    }
  ]
}

const options = {
  swaggerDefinition,
  failOnErrors: true,
  apis: ['./server/src/routes/ping.js']
}

module.exports = options
