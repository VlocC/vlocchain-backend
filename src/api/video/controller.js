import AWS from 'aws-sdk'
import { awsAccessKey, awsAccessSecret } from '../../config'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Video } from '.'

const s3 = new AWS.S3({
  endpoint: `https://s3.csh.rit.edu/`,
  accessKeyId: awsAccessKey,
  secretAccessKey: awsAccessSecret,
  region: 'us-east-1',
  s3ForcePathStyle: true
})

export const create = async ({ user, bodymen: { body } }, res, next) => {
  console.log('In create')
  const data = Object.assign({}, body, {thumbnailUrl: 'id.contentType'})
  Video.create({ ...data, creator: user })
    .then((video) => {
      uploadThumbnailToS3(body.thumbnailUrl, video._id)
      return video.view(true)
    })
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

const uploadThumbnailToS3 = (data, id) => {
  console.log('before promise chain', id)
  return new Promise(resolve => {
    const value = Buffer.from(data, 'binary')
    const params = {
      Body: value,
      Bucket: 'vlocchain',
      Key: `${id}.jpg`,
      ACL: 'public-read'
    }
    s3.putObject(params, function (err, ndata) {
      if (err) console.log(err, err.stack)
      else {
        resolve(ndata)
      }
    })
  })
}
