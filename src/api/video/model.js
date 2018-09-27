import mongoose, { Schema } from 'mongoose'

const videoSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  creatorId: {
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
  thumbnailUrl: {
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
      creatorId: this.creatorId,
      title: this.title,
      description: this.description,
      duration: this.duration,
      thumbnailUrl: this.thumbnailUrl,
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
