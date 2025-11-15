// tests/unit/attendance.service.test.js
const { 
  registerAttendance, 
  listAttendance, 
  getAttendanceById, 
  updateAttendance, 
  deleteAttendance 
} = require('../../src/services/attendance.service');

const { Attendance, Event, Participant } = require('../../src/models');
const { client } = require('../../src/cache/redisClient');

jest.mock('../../src/models');
jest.mock('../../src/cache/redisClient');

beforeEach(() => {
  jest.clearAllMocks();
  client.del = jest.fn().mockResolvedValue(1); // Mock Redis
});

describe('Attendance Service', () => {

  // ======================================
  // registerAttendance
  // ======================================
  describe('registerAttendance', () => {
    test('Debe lanzar EVENT_NOT_FOUND si el evento no existe', async () => {
      Event.findByPk.mockResolvedValue(null);
      Participant.findByPk.mockResolvedValue({ id: 'y' });

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('EVENT_NOT_FOUND');

      expect(Attendance.create).not.toHaveBeenCalled();
    });

    test('Debe lanzar PARTICIPANT_NOT_FOUND si el participante no existe', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 10 });
      Participant.findByPk.mockResolvedValue(null);

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('PARTICIPANT_NOT_FOUND');

      expect(Attendance.create).not.toHaveBeenCalled();
    });

    test('Debe lanzar EVENT_FULL si el evento está lleno', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 1 });
      Participant.findByPk.mockResolvedValue({ id: 'y' });
      Attendance.count.mockResolvedValue(1);

      await expect(registerAttendance({ eventId: 'x', participantId: 'y' }))
        .rejects.toThrow('EVENT_FULL');

      expect(Attendance.create).not.toHaveBeenCalled();
    });

    test('Debe crear asistencia correctamente y limpiar caché', async () => {
      Event.findByPk.mockResolvedValue({ id: 'x', capacity: 10 });
      Participant.findByPk.mockResolvedValue({ id: 'y' });
      Attendance.count.mockResolvedValue(0);
      Attendance.create.mockResolvedValue({ id: 'att1', eventId: 'x' });

      const result = await registerAttendance({ eventId: 'x', participantId: 'y' });

      expect(result).toEqual({ id: 'att1', eventId: 'x' });
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
    });
  });

  // ======================================
  // listAttendance
  // ======================================
  describe('listAttendance', () => {
    test('Debe devolver todas las asistencias', async () => {
      Attendance.findAll.mockResolvedValue([{ id: 'att1' }, { id: 'att2' }]);

      const result = await listAttendance();
      expect(result).toEqual([{ id: 'att1' }, { id: 'att2' }]);
    });
  });

  // ======================================
  // getAttendanceById
  // ======================================
  describe('getAttendanceById', () => {
    test('Debe devolver asistencia por id', async () => {
      Attendance.findByPk.mockResolvedValue({ id: 'att1' });

      const result = await getAttendanceById('att1');
      expect(result).toEqual({ id: 'att1' });
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(getAttendanceById('attX')).rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

  // ======================================
  // updateAttendance
  // ======================================
  describe('updateAttendance', () => {
    test('Debe actualizar asistencia correctamente', async () => {
      const attendance = { id: 'att1', eventId: 'x', update: jest.fn() };
      Attendance.findByPk.mockResolvedValue(attendance);

      const result = await updateAttendance('att1', { status: 'checked' });

      expect(attendance.update).toHaveBeenCalledWith({ status: 'checked' });
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
      expect(result).toEqual(attendance);
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(updateAttendance('attX', { status: 'checked' }))
        .rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

  // ======================================
  // deleteAttendance
  // ======================================
  describe('deleteAttendance', () => {
    test('Debe eliminar asistencia correctamente', async () => {
      const attendance = { id: 'att1', eventId: 'x', destroy: jest.fn().mockResolvedValue() };
      Attendance.findByPk.mockResolvedValue(attendance);

      const result = await deleteAttendance('att1');

      expect(attendance.destroy).toHaveBeenCalled();
      expect(client.del).toHaveBeenCalledWith('event:x:stats');
      expect(result).toEqual({ message: "Attendance deleted successfully" });
    });

    test('Debe lanzar ATTENDANCE_NOT_FOUND si no existe', async () => {
      Attendance.findByPk.mockResolvedValue(null);

      await expect(deleteAttendance('attX')).rejects.toThrow('ATTENDANCE_NOT_FOUND');
    });
  });

});
