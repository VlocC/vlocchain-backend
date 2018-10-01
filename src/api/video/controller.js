import axios from 'axios'
import AWS from 'aws-sdk'
import { awsAccessKey, awsAccessSecret } from '../../config'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Video } from '.'

const s3 = new AWS.S3({
  endpoint: `https://s3.csh.rit.edu`,
  accessKeyId: awsAccessKey,
  secretAccessKey: awsAccessSecret,
  region: 'us-east-1'
})

export const create = async ({ user, bodymen: { body } }, res, next) => {
  const s3ThumbnailUrl = await uploadThumbnailToS3(body.thumbnailUrl)
  Video.create({ ...body, creator: user })
    .then((video) => video.view(true))
    .then(success(res, 201))
    .catch(next)
}

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

const uploadThumbnailToS3 = (thumbnailUrl) => {
  return axios.get(thumbnailUrl)
    .then((response) => {
      var params = {
        Body: response.data,
        Bucket: 'vlocchain',
        Key: 'test0'
      }
      s3.putObject(params, function (err, data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
      })
    })
}
