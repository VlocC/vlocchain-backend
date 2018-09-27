import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Video } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, video

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  video = await Video.create({ creator: user })
})

test('POST /videos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, creatorId: 'test', title: 'test', description: 'test', duration: 'test', thumbnailUrl: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.creatorId).toEqual('test')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.duration).toEqual('test')
  expect(body.thumbnailUrl).toEqual('test')
  expect(typeof body.creator).toEqual('object')
})

test('POST /videos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /videos 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /videos/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${video.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(video.id)
})

test('GET /videos/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /videos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${video.id}`)
    .send({ access_token: userSession, creatorId: 'test', title: 'test', description: 'test', duration: 'test', thumbnailUrl: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(video.id)
  expect(body.creatorId).toEqual('test')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.duration).toEqual('test')
  expect(body.thumbnailUrl).toEqual('test')
  expect(typeof body.creator).toEqual('object')
})

test('PUT /videos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${video.id}`)
    .send({ access_token: anotherSession, creatorId: 'test', title: 'test', description: 'test', duration: 'test', thumbnailUrl: 'test' })
  expect(status).toBe(401)
})

test('PUT /videos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${video.id}`)
  expect(status).toBe(401)
})

test('PUT /videos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, creatorId: 'test', title: 'test', description: 'test', duration: 'test', thumbnailUrl: 'test' })
  expect(status).toBe(404)
})

test('DELETE /videos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${video.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /videos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${video.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /videos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${video.id}`)
  expect(status).toBe(401)
})

test('DELETE /videos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
