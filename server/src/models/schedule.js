'use strict'

const { model, Schema } = require('mongoose')
const mongoose = require('mongoose')

const commentDefinition = {
  date: {
    type: Date,
    required: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}

const commentSchema = new Schema(commentDefinition, { timestamps: true, id: true })

const lessonDefinition = {
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
}

const lessonSchema = new Schema(lessonDefinition, { timestamps: true, id: true })

lessonSchema.virtual('duration').get(function () {
  return this.endTime - this.startTime
})

const windowDefinition = {
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  lessons: [lessonSchema]
}

const windowSchema = new Schema(windowDefinition, { timestamps: true, id: true })

windowSchema.virtual('duration').get(function () {
  return this.endTime - this.startTime
})

const scheduleDefinition = {
  date: {
    type: Date,
    required: true
  },
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basePrice: {
    type: Number,
    default: 0
  },
  breakTime: {
    type: Number,
    default: 10 * 60 * 1000 // 10 min
  },
  minLessonTime: {
    type: Number,
    default: 5 * 60 * 1000 // 5 min
  },
  maxLessonTimeByOneUser: {
    type: Number,
    default: 2 * 60 * 60 * 1000 // 120 min
  },
  windows: [windowSchema]
}

const schema = new Schema(scheduleDefinition, { timestamps: true, id: true })

const Schedule = model('Schedule', schema)

module.exports = {
  Schedule,
  scheduleSchema: scheduleDefinition,
  windowSchema: windowDefinition,
  lessonSchema: lessonDefinition,
  commentSchema: commentDefinition
}
