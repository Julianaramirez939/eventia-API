const sequelize = require('../config/database');

const EventModel = require('./event.model');
const ParticipantModel = require('./participant.model');
const AttendanceModel = require('./attendance.model');

const Event = EventModel(sequelize);
const Participant = ParticipantModel(sequelize);
const Attendance = AttendanceModel(sequelize);


Event.belongsToMany(Participant, { 
  through: Attendance, 
  foreignKey: 'eventId'
});

Participant.belongsToMany(Event, { 
  through: Attendance, 
  foreignKey: 'participantId'
});


Attendance.belongsTo(Event, { foreignKey: 'eventId' });
Attendance.belongsTo(Participant, { foreignKey: 'participantId' });


Event.hasMany(Attendance, { foreignKey: 'eventId' });
Participant.hasMany(Attendance, { foreignKey: 'participantId' });

module.exports = { sequelize, Event, Participant, Attendance };
