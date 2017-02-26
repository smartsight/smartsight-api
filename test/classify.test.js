const test = require('ava')
const { expect } = require('chai')
const request = require('supertest-koa-agent')
const app = require('../app')

const api = request(app)
const endpoint = '/v1/classify'

test.cb(`POST ${endpoint} with JPG image returns 200`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.jpg')
    .expect(200)
    .end((err, res) => {
      if (err) {
        throw err
      }

      t.end()
    })
})

test.cb(`POST ${endpoint} with wrong image format returns 415`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.png')
    .expect(415)
    .end((err, res) => {
      if (err) {
        throw err
      }

      t.end()
    })
})

test.cb(`POST ${endpoint} with unprocessable entity returns 422`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/corrupted-pizza.jpg')
    .expect(422)
    .end((err, res) => {
      if (err) {
        throw err
      }

      t.end()
    })
})

test.cb(`POST ${endpoint} with image returns valid JSON schema`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.jpg')
    .end((err, res) => {
      if (err) {
        throw err
      }

      const { meta, data } = JSON.parse(res.text)

      expect(meta).to.include.keys('type', 'code')

      data.forEach(classification => {
        expect(classification).to.include.keys('class', 'score')
      })

      t.end()
    })
})

test.cb(`POST ${endpoint} with wrong image format returns valid error JSON schema`, t => {
  api
    .post(endpoint)
    .attach('file', 'test/fixture/pizza.png')
    .end((err, res) => {
      if (err) {
        throw err
      }

      const { error } = JSON.parse(res.text)

      expect(error).to.include.keys('code', 'message', 'url')

      t.end()
    })
})
