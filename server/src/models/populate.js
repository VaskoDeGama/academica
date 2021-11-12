const schedulePopulate = {
  populate: [
    {
      path: 'teacher',
      select: 'firstName + lastName + skype'
    },
    {
      path: 'windows',
      populate: [
        {
          path: 'lessons',
          select: '-comments',
          populate: [
            {
              path: 'student',
              select: 'firstName + lastName + skype'
            }
          ]
        }
      ]
    }
  ]
}

const windowPopulate = {
  populate: [
    {
      path: 'schedule',
      select: 'teacher',
      populate: [
        {
          path: 'teacher',
          select: 'firstName + lastName + skype'
        }
      ]
    },
    {
      path: 'lessons',
      select: '-comments',
      populate: [
        {
          path: 'student',
          select: 'firstName + lastName + skype'
        }
      ]
    }
  ]
}

const lessonPopulate = {
  populate: [
    {
      path: 'student',
      select: 'firstName + lastName + skype + teacher'
    },
    {
      path: 'window',
      select: 'startTime + endTime'
    },
    {
      path: 'comments',
      select: '-lesson'
    }
  ]
}

const commentPopulate = {
  populate: [
    {
      path: 'author',
      select: 'firstName + lastName + skype + teacher'
    },
    {
      path: 'lesson',
      select: '-comments',
      populate: [
        {
          path: 'student',
          select: 'firstName + lastName + skype + teacher'
        },
        {
          path: 'window',
          select: 'startTime + endTime'
        },
        {
          path: 'comments',
          select: '-lesson'
        }
      ]
    }
  ]
}

const allSchedulePopulate = {
  populate: [
    {
      path: 'teacher',
      select: 'firstName + lastName + skype'
    },
    {
      path: 'windows',
      populate: [
        {
          path: 'lessons',
          select: '-comments',
          populate: [
            {
              path: 'student',
              select: 'firstName + lastName + skype'
            }
          ]
        }
      ]
    }
  ]
}

module.exports = {
  schedulePopulate,
  lessonPopulate,
  windowPopulate,
  commentPopulate,
  allSchedulePopulate
}
