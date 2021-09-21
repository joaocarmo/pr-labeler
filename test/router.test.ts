import * as express from 'express'
import userRouter from '../src/router'

jest.mock('express')

const getRouter: any = () => express.Router()

describe('Test the custom routes', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  it('should return alive status', () => {
    const mockRouter: any = { get: jest.fn() }

    jest.spyOn(express, 'Router').mockImplementationOnce(() => mockRouter)

    const mockReq = {}
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockNext = jest.fn()

    mockRouter.get.mockImplementation((path: string, callback: any) => {
      if (path === '/health') {
        callback(mockReq, mockRes, mockNext)
      }
    })

    userRouter(getRouter)

    expect(mockRes.status).toBeCalledWith(200)
    expect(mockRes.json).toBeCalledWith({ status: 'alive' })
  })
})
