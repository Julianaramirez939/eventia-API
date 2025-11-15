const path = require('path');

// ----------------------------
// MOCKS DE MODELOS
// ----------------------------
jest.mock(path.resolve(__dirname, '../../src/models'), () => ({
  Event: { findByPk: jest.fn() },
  Participant: { findByPk: jest.fn() },
  Attendance: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    create: jest.fn()
  }
}));

// ----------------------------
// MOCK DE REDIS (por defecto ABIERTO)
// ----------------------------
jest.mock(path.resolve(__dirname, '../../src/cache/redisClient'), () => ({
  client: {
    isOpen: true,
    del: jest.fn(),
  }
}));

const {
  registerAttendance,
  listAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
} = require('../../src/services/attendance.service');

const { Event, Participant, Attendance } = require('../../src/models');
const { client } = require('../../src/cache/redisClient');

// ----------------------------
// TEST SUITE
// ----------------------------
describe('Attendance Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    Attendance.findOne.mockResolvedValue(null);
    Attendance.create.mockResolvedValue({ id: 'test-attendance', eventId: 'x' });
    Attendance.findAll.mockResolvedValue([{ id: 'a1' }]);
  });

  // -------------------
  // registerAttendance
  // -------------------
  describe('registerAttendance', () => {

    test('Debe lanzar EVENT_NOT_FOUND si el evento no existe', async () => {
      Event.findByPk.mockResolvedValue(null);
      Participant.findByPk.mockResolvedValue({ id: 'y' });

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('EVENT_NOT_FOUND');
    });

    test('Debe lanzar PARTICIPANT_NOT_FOUND si el participante no existe', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 10 });
      Participant.findByPk.mockResolvedValue(null);

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('PARTICIPANT_NOT_FOUND');
    });

    test('Debe lanzar EVENT_FULL si el evento está lleno', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 1 });
      Participant.findByPk.mockResolvedValue({ id: 'y' });
      Attendance.count.mockResolvedValue(1);

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('EVENT_FULL');
    });

    test('Debe crear asistencia correctamente y limpiar caché si Redis está abierto', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 10 });
      Participant.findByPk.mockResolvedValue({ id: 'y' });
      Attendance.count.mockResolvedValue(0);

      const result = await registerAttendance({ eventId: 'x', participantId: 'y' });

      expect(result).toEqual({ id: 'test-attendance', eventId: 'x' });
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
    });

    test('NO debe limpiar caché si Redis está cerrado', async () => {
      client.isOpen = false;

      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 10 });
      Participant.findByPk.mockResolvedValue({ id: 'y' });
      Attendance.count.mockResolvedValue(0);

      await registerAttendance({ eventId: 'x', participantId: 'y' });

      expect(client.del).not.toHaveBeenCalled();

      client.isOpen = true; // restaurar
    });

  });

  // -------------------
  // listAttendance
  // -------------------
  describe('listAttendance', () => {
    test('Debe devolver todas las asistencias', async () => {
      const result = await listAttendance();
      expect(result).toEqual([{ id: 'a1' }]);
    });
  });

  // -------------------
  // getAttendanceById
  // -------------------
  describe('getAttendanceById', () => {
    test('Debe devolver asistencia si existe', async () => {
      Attendance.findByPk.mockResolvedValue({ id: 'a1' });

      const result = await getAttendanceById('a1');
      expect(result).toEqual({ id: 'a1' });
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(getAttendanceById('x'))
        .rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

  // -------------------
  // updateAttendance
  // -------------------
  describe('updateAttendance', () => {
    test('Debe actualizar asistencia y limpiar caché si Redis está abierto', async () => {
      const attendance = { id: 'a1', eventId: 'x', update: jest.fn().mockResolvedValue() };
      Attendance.findByPk.mockResolvedValue(attendance);

      const result = await updateAttendance('a1', { status: 'checked' });

      expect(attendance.update).toHaveBeenCalledWith({ status: 'checked' });
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
      expect(result).toEqual(attendance);
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(updateAttendance('x', {}))
        .rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

  // -------------------
  // deleteAttendance
  // -------------------
  describe('deleteAttendance', () => {
    test('Debe eliminar asistencia y limpiar caché si Redis está abierto', async () => {
      const attendance = { id: 'a1', eventId: 'x', destroy: jest.fn().mockResolvedValue() };
      Attendance.findByPk.mockResolvedValue(attendance);

      const result = await deleteAttendance('a1');

      expect(attendance.destroy).toHaveBeenCalled();
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
      expect(result).toEqual({ message: "Attendance deleted successfully" });
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(deleteAttendance('x'))
        .rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

});
