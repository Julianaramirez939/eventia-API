// __mocks__/src/models.js

module.exports = {
  Event: {
    findByPk: jest.fn(),
  },
  Participant: {
    findByPk: jest.fn(),
  },
  Attendance: {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  sequelize: {
    sync: jest.fn(),
    close: jest.fn(),
  },
};
