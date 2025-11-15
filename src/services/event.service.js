const { Event, Attendance } = require("../models");
const { client } = require("../cache/redisClient");

async function createEvent(data) {
  return await Event.create(data);
}

async function listEvents() {
  return await Event.findAll();
}

async function getEventById(id) {
  const event = await Event.findByPk(id);
  if (!event) throw new Error("EVENT_NOT_FOUND");
  return event;
}

async function updateEvent(id, data) {
  const event = await Event.findByPk(id);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  await event.update(data);
  return event;
}

async function deleteEvent(id) {
  const event = await Event.findByPk(id);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  await event.destroy();
  return { message: "Event deleted successfully" };
}
async function getEventStats(eventId) {
  const cacheKey = `event:${eventId}:stats`;

  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const event = await Event.findByPk(eventId);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const attended = await Attendance.count({
    where: { eventId, status: "attended" },
  });

  const stats = { eventId, attended };

  await client.set(cacheKey, JSON.stringify(stats), { EX: 30 });

  return stats;
}
module.exports = {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStats,
};
