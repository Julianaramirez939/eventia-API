const eventService = require('../services/event.service');

async function create(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body);
    return res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

async function index(req, res, next) {
  try {
    const events = await eventService.listEvents();
    return res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const event = await eventService.getEventById(req.params.id);
    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    return res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const response = await eventService.deleteEvent(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
async function stats(req, res, next) {
  try {
    const stats = await eventService.getEventStats(req.params.id);
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  index,
  show,
  update,
  remove,
  stats
};
