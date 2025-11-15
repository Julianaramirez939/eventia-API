const participantService = require('../services/participant.service');

async function create(req, res, next) {
  try {
    const participant = await participantService.createParticipant(req.body);
    return res.status(201).json(participant);
  } catch (err) {
    next(err);
  }
}

async function index(req, res, next) {
  try {
    const participants = await participantService.listParticipants();
    return res.status(200).json(participants);
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const participant = await participantService.getParticipantById(req.params.id);
    return res.status(200).json(participant);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const participant = await participantService.updateParticipant(req.params.id, req.body);
    return res.status(200).json(participant);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const response = await participantService.deleteParticipant(req.params.id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, index, show, update, remove };
