'use strict'

const BaseController = require('../../controllers/base-controller')

const mockResponse = {}
const mockRequest = {
  app: { servLog: { error: jest.fn() } }
}

describe('BaseController', () => {
  it('defined', () => {
    expect(BaseController).toBeDefined()
  })

  beforeEach(() => {
    mockResponse.body = null
    mockResponse.statusCode = null
    mockResponse.status = function (code) {
      this.statusCode = code
      return this
    }
    mockResponse.json = function (obj) {
      this.body = JSON.stringify(obj)
      return this
    }
    mockResponse.toOBJ = function () {
      const result = {
        status: this.statusCode
      }

      if (this.body) {
        result.body = this.body
      }

      return result
    }
  })

  it('class', () => {
    expect(typeof BaseController.constructor).toBe('function')
  })

  it('jsonResponse dto', () => {
    const expectValue = {
      status: 200,
      body: JSON.stringify({
        reqId: 'test',
        success: true,
        status: 200
      })
    }

    const result = BaseController.jsonResponse({
      res: mockResponse,
      dto: {
        reqId: 'test',
        success: true,
        status: 200
      }
    })

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('jsonResponse code mesaage', () => {
    const expectValue = {
      status: 404,
      body: JSON.stringify({
        message: 'NotFound'
      })
    }

    const result = BaseController.jsonResponse({
      res: mockResponse,
      code: 404,
      message: 'NotFound'
    })

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('jsonResponse  mesaage', () => {
    const expectValue = {
      status: 404
    }

    const result = BaseController.jsonResponse({
      res: mockResponse,
      code: 404
    })

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('ok dto', () => {
    const expectValue = {
      status: 200,
      body: JSON.stringify({
        reqId: 'test',
        success: true,
        status: 200,
        data: {
          role: 'teacher',
          balance: '0',
          username: 'test8',
          createdAt: '2021-08-20T07:08:41.248Z',
          updatedAt: '2021-08-20T07:08:41.248Z',
          id: '611f54f9bf067e641f8e5209'
        }
      })
    }

    const result = BaseController.ok(mockResponse, {
      reqId: 'test',
      success: true,
      status: 200,
      data: {
        role: 'teacher',
        balance: '0',
        username: 'test8',
        createdAt: '2021-08-20T07:08:41.248Z',
        updatedAt: '2021-08-20T07:08:41.248Z',
        id: '611f54f9bf067e641f8e5209'
      }
    })

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('ok code', () => {
    const expectValue = {
      status: 200
    }

    const result = BaseController.ok(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('created', () => {
    const expectValue = {
      status: 201
    }

    const result = BaseController.created(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('clientError', () => {
    const expectValue = {
      status: 400,
      body: JSON.stringify({
        message: 'Bad Request'
      })
    }

    const result = BaseController.clientError(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('unauthorized', () => {
    const expectValue = {
      status: 401,
      body: JSON.stringify({
        message: 'Unauthorized'
      })
    }

    const result = BaseController.unauthorized(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('paymentRequired', () => {
    const expectValue = {
      status: 402,
      body: JSON.stringify({
        message: 'Payment required'
      })
    }

    const result = BaseController.paymentRequired(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('forbidden', () => {
    const expectValue = {
      status: 403,
      body: JSON.stringify({
        message: 'Forbidden'
      })
    }

    const result = BaseController.forbidden(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('notFound', () => {
    const expectValue = {
      status: 404,
      body: JSON.stringify({
        message: 'Not found'
      })
    }

    const result = BaseController.notFound(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('conflict', () => {
    const expectValue = {
      status: 409,
      body: JSON.stringify({
        message: 'Conflict'
      })
    }

    const result = BaseController.conflict(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('tooMany', () => {
    const expectValue = {
      status: 429,
      body: JSON.stringify({
        message: 'Too many requests'
      })
    }

    const result = BaseController.tooMany(mockResponse)

    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('fail dto', () => {
    const expectValue = {
      status: 404,
      body: JSON.stringify({
        success: false,
        status: 404,
        errors: [
          { msg: 'notFound', type: Error }
        ]
      })
    }

    const result = BaseController.fail({
      req: mockRequest,
      res: mockResponse,
      dto: {
        success: false,
        status: 404,
        errors: [
          { msg: 'notFound', type: Error }
        ]
      }
    })
    expect(mockRequest.app.servLog.error.mock.calls.length).toBe(0)
    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('fail code message', () => {
    const expectValue = {
      status: 429,
      body: JSON.stringify({
        message: 'Too many requests'
      })
    }

    const result = BaseController.fail({
      req: mockRequest,
      res: mockResponse,
      code: 429,
      message: 'Too many requests'
    })

    expect(mockRequest.app.servLog.error.mock.calls.length).toBe(0)
    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('fail code with log', () => {
    const expectValue = {
      status: 500,
      body: JSON.stringify({
        message: 'Internal Server Error'
      })
    }

    const result = BaseController.fail({
      req: mockRequest,
      res: mockResponse
    })

    expect(mockRequest.app.servLog.error.mock.calls.length).toBe(1)
    expect(result.toOBJ()).toStrictEqual(expectValue)
  })

  it('setResponse complex', () => {
    const testData = [
      {
        expect: {
          status: 200
        },
        args: {
          code: 200
        }
      },
      {
        expect: {
          status: 201
        },
        args: {
          code: 201
        }
      },
      {
        expect: {
          status: 429,
          body: JSON.stringify({
            message: 'Too many requests'
          })
        },
        args: {
          code: 429
        }
      },
      {
        expect: {
          status: 409,
          body: JSON.stringify({
            message: 'Conflict'
          })
        },
        args: {
          code: 409
        }
      },
      {
        expect: {
          status: 404,
          body: JSON.stringify({
            message: 'Not found'
          })
        },
        args: {
          code: 404
        }
      },
      {
        expect: {
          status: 403,
          body: JSON.stringify({
            message: 'Forbidden'
          })
        },
        args: {
          code: 403
        }
      },
      {
        expect: {
          status: 402,
          body: JSON.stringify({
            message: 'Payment required'
          })
        },
        args: {
          code: 402
        }
      },
      {
        expect: {
          status: 401,
          body: JSON.stringify({
            message: 'Unauthorized'
          })
        },
        args: {
          code: 401
        }
      },
      {
        expect: {
          status: 400,
          body: JSON.stringify({
            message: 'Bad Request'
          })
        },
        args: {
          code: 400
        }
      },
      {
        expect: {
          status: 200,
          body: JSON.stringify({
            reqId: 'test',
            success: true,
            status: 200,
            data: {
              role: 'teacher',
              balance: '0',
              username: 'test8',
              createdAt: '2021-08-20T07:08:41.248Z',
              updatedAt: '2021-08-20T07:08:41.248Z',
              id: '611f54f9bf067e641f8e5209'
            }
          })
        },
        args: {
          dto: {
            reqId: 'test',
            success: true,
            status: 200,
            data: {
              role: 'teacher',
              balance: '0',
              username: 'test8',
              createdAt: '2021-08-20T07:08:41.248Z',
              updatedAt: '2021-08-20T07:08:41.248Z',
              id: '611f54f9bf067e641f8e5209'
            }
          }
        }
      },
      {
        expect: {
          status: 404,
          body: JSON.stringify({
            success: false,
            status: 404,
            errors: [
              { msg: 'notFound', type: 'Custom' }
            ]
          })
        },
        args: {
          dto: {
            success: false,
            status: 404,
            errors: [
              { msg: 'notFound', type: 'Custom' }
            ]
          }
        }
      },

      {
        expect: {
          status: 501,
          body: JSON.stringify({
            message: 'Not Implemented'
          })
        },
        args: {
          code: 501,
          message: 'Not Implemented'
        }
      },
      {
        expect: {
          status: 500,
          body: JSON.stringify({
            message: 'Internal Server Error'
          })
        },
        args: {
          code: 500
        }
      }

    ]

    for (const test of testData) {
      const result = BaseController.setResponse({
        req: mockRequest,
        res: mockResponse,
        ...test.args
      })
      expect(result.toOBJ()).toStrictEqual(test.expect)
    }

    expect(mockRequest.app.servLog.error.mock.calls.length).toBe(1)
  })
})
