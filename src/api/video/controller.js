import request from 'request'
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

const uploadThumbnailToS3 = (data) => {
  console.log('before promise chain')
  return new Promise(resolve => {
    console.log('LENGTH:', data.length)
    const value = Buffer.from(data, 'binary')
    console.log('My new Vlaue: ', value)
    const params = {
      Body: value,
      Bucket: 'vlocchain',
      Key: 'thing.jpg',
      ACL: 'public-read'
    }
    console.log('params', params)
    s3.putObject(params, function (err, ndata) {
      if (err) console.log(err, err.stack)
      else {
        console.log(ndata)
        resolve(ndata)
      }
    })
  })
}

// const uploadThumbnailToS3 = (url) => {
//   console.log('before promise chain')
//   return new Promise(resolve => {
//     request({
//       url,
//       method: 'GET',
//       encoding: null
//     }, function (error, response, body) {
//       if (!error) {
//         resolve(body)
//       }
//       console.log(error)
//     })
//   }).then(value => {
//     console.log(value)
//     var params = {
//       Body: value,
//       Bucket: 'vlocchain',
//       Key: 'thing.jpg',
//       ACL: 'public-read'
//     }
//     s3.putObject(params, function (err, data) {
//       if (err) console.log(err, err.stack)
//       else console.log(data)
//     })
//   })
// }
