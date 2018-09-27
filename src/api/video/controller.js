import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Video } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Video.create({ ...body, creator: user })
    .then((video) => video.view(true))
    .then(success(res, 201))
    .catch(next)

export const getMultipleVideos = ({ querymen: { query, select, cursor } }, res, next) =>
  Video.find(query, select, cursor)
    .populate('creator')
    .then((videos) => videos.map((video) => video.view()))
    .then(success(res))
    .catch(next)

export const getVideo = ({ params }, res, next) =>
  Video.findById(params.id)
    .populate('creator')
    .then(notFound(res))
    .then((video) => video ? video.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Video.findById(params.id)
    .populate('creator')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then((video) => video ? Object.assign(video, body).save() : null)
    .then((video) => video ? video.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Video.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then((video) => video ? video.remove() : null)
    .then(success(res, 204))
    .catch(next)
