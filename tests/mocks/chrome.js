global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
  storage: {
    local: {
      get: jest.fn((key, callback) => callback({})),
      set: jest.fn((items, callback) => callback && callback()),
    },
  },
  tabs: {
    query: jest.fn((_, callback) => callback([{ id: 1, active: true }])),
  },
}