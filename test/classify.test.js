const test = require('ava')
const { expect } = require('chai')
const request = require('supertest-koa-agent')
const app = require('../app')

const api = request(app)

test('POST /classify with JPG image', t => {
  api
    .post('/classify')
    .attach('file', 'test/fixture/pizza.jpg')
    .expect(200)
})

test('POST /classify with PNG image', t => {
  api
    .post('/classify')
    .attach('file', 'test/fixture/pizza.png')
    .expect(200)
})

test('POST /classify with wrong format returns 415', t => {
  api
    .post('/classify')
    .attach('file', 'README.md')
    .expect(415)
})

test.cb('POST /classify returns valid JSON schema', t => {
  api
    .post('/classify')
    .attach('file', 'test/fixture/pizza.jpg')
    .end((err, res) => {
      if (err) {
        throw err
      }

      JSON.parse(res.text).forEach(classification => {
        expect(classification).to.include.keys('class', 'confidence')
        expect(classification.confidence).to.be.within(0, 1)
      })

      t.end()
    })
})

test.cb('POST /classify returns a valid classification', t => {
  api
    .post('/classify')
    .attach('file', 'test/fixture/pizza.jpg')
    .end((err, res) => {
      if (err) {
        throw err
      }

      const classification = JSON.parse(res.text)[0]

      expect(classification.class).to.equal('pizza')
      expect(classification.confidence).to.be.above(0.5)

      t.end()
    })
})
