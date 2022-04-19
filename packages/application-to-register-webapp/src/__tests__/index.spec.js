describe('server wrapper', () => {
  it('runs initialisation', done => {
    jest.isolateModules(() => {
      try {
        jest.mock('../server.js')
        const { createServer, init } = require('../server.js')
        createServer.mockImplementation(() => Promise.resolve())
        init.mockImplementation(() => Promise.resolve())
        require('../index.js')
        setImmediate(() => {
          expect(createServer).toHaveBeenCalled()
          expect(init).toHaveBeenCalled()
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })

  it('has initialisation failure', done => {
    jest.isolateModules(() => {
      try {
        jest.mock('../server.js')
        const { createServer, init } = require('../server.js')
        createServer.mockImplementation(() => Promise.resolve())
        init.mockImplementation(() => Promise.reject(new Error()))
        const processExitSpy = jest
          .spyOn(process, 'exit')
          .mockImplementation(code => {})
        require('../index')
        setImmediate(() => {
          expect(init).toHaveBeenCalled()
          expect(createServer).toHaveBeenCalled()
          expect(processExitSpy).toHaveBeenCalledWith(1)
          done()
        })
      } catch (e) {
        done(e)
      }
    })
  })
})
