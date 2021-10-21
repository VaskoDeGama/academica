'use strict'

/**
 * @param {number} [timestamp=Date.now()]
 * @returns {Date} - date with zero h, m, s, ms
 */
function getDay (timestamp = Date.now()) {
  const date = new Date(timestamp)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date
}

/**
 * @param {number} timestamp = Date.now()
 * @param {number} hours = 0
 * @param {number} minutes = 0
 * @returns {Date} - date with h and m and zero m, s
 */
function setTime (timestamp = Date.now(), hours = 0, minutes = 0) {
  const date = getDay(timestamp)
  if (hours >= 0 && hours <= 23) {
    date.setHours(hours)
  }
  if (hours >= 0 && hours <= 59) {
    date.setMinutes(minutes)
  }
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

/**
 * @param {object} window
 * @param {Date} window.startTime
 * @param {Date} window.endTime
 * @param {object[]} window.lessons
 * @param {number} minLessonTime
 * @param {number} breakTime
 * @returns {object[]}
 */
function getSlots ({ startTime, endTime, lessons }, minLessonTime, breakTime) {
  if (lessons?.length === 0) {
    return [{
      startTime,
      endTime,
      duration: endTime?.getTime() - startTime?.getTime()
    }]
  }

  const sortLessons = lessons.sort((a, b) => a.startTime?.getTime() - b.startTime.getTime())
  const slots = []

  for (let i = 0; i < lessons.length; i += 1) {
    const lesson = lessons[i]
    const lessonStartTime = lesson.startTime?.getTime()
    const lessonEndTime = lesson.startTime?.getTime()

    if (i === 0) {
      const timeFromWindowStart = lessonStartTime - startTime?.getTime()
      if (timeFromWindowStart > minLessonTime + breakTime) {
        const slotEndTime = new Date(lessonStartTime - breakTime)
        slots.push({
          startTime,
          endTime: slotEndTime,
          duration: slotEndTime - startTime?.getTime()
        })
      }
    } else if (i === sortLessons?.length - 1) {
      const timeBeforeWindowEnd = endTime?.getTime() + breakTime - lessonEndTime
      if (timeBeforeWindowEnd > minLessonTime) {
        const slotStartTime = new Date(lessonEndTime + breakTime)
        slots.push({
          startTime: slotStartTime,
          endTime: endTime,
          duration: endTime?.getTime() - slotStartTime
        })
      }
    } else {
      const prevLesson = lesson[i - 1]
      const prevLessonEndTime = prevLesson.startTime?.getTime() + breakTime
      const duration = lessonStartTime - prevLessonEndTime

      if (duration > minLessonTime + breakTime) {
        slots.push({
          startTime: new Date(prevLessonEndTime),
          endTime: new Date(lessonStartTime - breakTime),
          duration: duration - breakTime
        })
      }
    }
  }

  return slots
}

module.exports = {
  getDay,
  setTime,
  getSlots
}
