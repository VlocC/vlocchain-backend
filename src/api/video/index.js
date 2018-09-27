import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, getMultipleVideos, getVideo, update, destroy } from './controller'
import { schema } from './model'
export Video, { schema } from './model'

const router = new Router()
const { creatorId, title, description, duration, thumbnailUrl } = schema.tree

/**
 * @api {post} /videos Create video
 * @apiName CreateVideo
 * @apiGroup Video
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam creatorId Video's creatorId.
 * @apiParam title Video's title.
 * @apiParam description Video's description.
 * @apiParam duration Video's duration.
 * @apiParam thumbnailUrl Video's thumbnailUrl.
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ creatorId, title, description, duration, thumbnailUrl }),
  create)

/**
 * @api {get} /videos Retrieve videos
 * @apiName RetrieveVideos
 * @apiGroup Video
 * @apiUse listParams
 * @apiSuccess {Object[]} videos List of videos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  getMultipleVideos)

/**
 * @api {get} /videos/:id Retrieve video
 * @apiName RetrieveVideo
 * @apiGroup Video
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 */
router.get('/:id',
  getVideo)

/**
 * @api {put} /videos/:id Update video
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam creatorId Video's creatorId.
 * @apiParam title Video's title.
 * @apiParam description Video's description.
 * @apiParam duration Video's duration.
 * @apiParam thumbnailUrl Video's thumbnailUrl.
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ creatorId, title, description, duration, thumbnailUrl }),
  update)

/**
 * @api {delete} /videos/:id Delete video
 * @apiName DeleteVideo
 * @apiGroup Video
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Video not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
