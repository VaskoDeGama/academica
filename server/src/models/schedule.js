'use strict'

const { model, Schema } = require('mongoose')
const mongoose = require('mongoose')

const commentDefinition = {
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
  },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson' }
}

const commentSchema = new Schema(commentDefinition, { timestamps: true, id: true })
const Comment = model('Comment', commentSchema)

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
  window: { type: Schema.Types.ObjectId, ref: 'Window' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}
const lessonSchema = new Schema(lessonDefinition, { timestamps: true, id: true })
const Lesson = model('Lesson', lessonSchema)

const windowDefinition = {
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
}
const windowSchema = new Schema(windowDefinition, { timestamps: true, id: true })
const Window = model('Window', windowSchema)

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
  windows: [{ type: Schema.Types.ObjectId, ref: 'Window' }]
}

const schema = new Schema(scheduleDefinition, { timestamps: true, id: true })

const Schedule = model('Schedule', schema)

module.exports = {
  Schedule,
  Window,
  Lesson,
  Comment,
  scheduleSchema: scheduleDefinition,
  windowSchema: windowDefinition,
  lessonSchema: lessonDefinition,
  commentSchema: commentDefinition
}
