const { Attendance, Event, Participant } = require("../models");
const { client } = require("../cache/redisClient");

async function registerAttendance(data) {
  const { eventId, participantId } = data;

  const event = await Event.findByPk(eventId);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const participant = await Participant.findByPk(participantId);
  if (!participant) throw new Error("PARTICIPANT_NOT_FOUND");

  const existing = await Attendance.findOne({
    where: { eventId, participantId },
  });

  if (existing) throw new Error("ALREADY_REGISTERED");

  // 🔥 Verificar si el evento ya está lleno
  const currentCount = await Attendance.count({
    where: { eventId },
  });

  if (currentCount >= event.capacity) {
    throw new Error("EVENT_FULL");
  }

  const attendance = await Attendance.create(data);

  // 🔥 Invalida caché de estadísticas del evento
  await client.del(`event:${eventId}:stats`);

  return attendance;
}

async function listAttendance() {
  return await Attendance.findAll();
}

async function getAttendanceById(id) {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) throw new Error("ATTENDANCE_NOT_FOUND");
  return attendance;
}

async function updateAttendance(id, data) {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) throw new Error("ATTENDANCE_NOT_FOUND");

  await attendance.update(data);

  // 🔥 Invalida caché
  await client.del(`event:${attendance.eventId}:stats`);

  return attendance;
}

async function deleteAttendance(id) {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) throw new Error("ATTENDANCE_NOT_FOUND");

  const eventId = attendance.eventId;

  await attendance.destroy();

  // 🔥 Invalida caché
  await client.del(`event:${eventId}:stats`);

  return { message: "Attendance deleted successfully" };
}

module.exports = {
  registerAttendance,
  listAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
