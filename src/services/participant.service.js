const { Participant } = require('../models');

async function createParticipant(data) {
  return await Participant.create(data);
}

async function listParticipants() {
  return await Participant.findAll();
}

async function getParticipantById(id) {
  const participant = await Participant.findByPk(id);
  if (!participant) throw new Error('PARTICIPANT_NOT_FOUND');
  return participant;
}

async function updateParticipant(id, data) {
  const participant = await Participant.findByPk(id);
  if (!participant) throw new Error('PARTICIPANT_NOT_FOUND');

  await participant.update(data);
  return participant;
}

async function deleteParticipant(id) {
  const participant = await Participant.findByPk(id);
  if (!participant) throw new Error('PARTICIPANT_NOT_FOUND');

  await participant.destroy();
  return { message: 'Participant deleted successfully' };
}

module.exports = {
  createParticipant,
  listParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
};
