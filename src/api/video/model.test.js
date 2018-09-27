import { Video } from '.'
import { User } from '../user'

let user, video

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  video = await Video.create({ creator: user, creator_id: 'test', title: 'test', description: 'test', duration: 'test', thumbnail_url: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = video.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(video.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.creator_id).toBe(video.creator_id)
    expect(view.title).toBe(video.title)
    expect(view.description).toBe(video.description)
    expect(view.duration).toBe(video.duration)
    expect(view.thumbnail_url).toBe(video.thumbnail_url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = video.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(video.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.creator_id).toBe(video.creator_id)
    expect(view.title).toBe(video.title)
    expect(view.description).toBe(video.description)
    expect(view.duration).toBe(video.duration)
    expect(view.thumbnail_url).toBe(video.thumbnail_url)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
