import mongoose, { Schema } from 'mongoose'

const videoSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  creator_id: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  duration: {
    type: String
  },
  thumbnail_url: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

videoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      creator: this.creator.view(full),
      creator_id: this.creator_id,
      title: this.title,
      description: this.description,
      duration: this.duration,
      thumbnail_url: this.thumbnail_url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Video', videoSchema)

export const schema = model.schema
export default model
