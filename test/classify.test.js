const test = require('ava')
const { expect } = require('chai')
const request = require('supertest-koa-agent')
const app = require('../app')

const api = request(app)
const endpoint = '/classify'

test(`POST ${endpoint} with JPG image`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.jpg')
    .expect(200)
})

test(`POST ${endpoint} with wrong format returns 415`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.png')
    .expect(415)
})

test.cb(`POST ${endpoint} returns valid JSON schema`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.jpg')
    .end((err, res) => {
      if (err) {
        throw err
      }

      const { meta, data } = JSON.parse(res.text)

      expect(meta).to.include.keys('type', 'code')

      JSON.parse(data).forEach(classification => {
        expect(classification).to.include.keys('class', 'score')
      })

      t.end()
    })
})

test.cb(`POST ${endpoint} wrong format returns valid error JSON schema`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.png')
    .end((err, res) => {
      if (err) {
        throw err
      }

      const { error } = JSON.parse(res.text)

      expect(error).to.include.keys('code', 'message')

      t.end()
    })
})
