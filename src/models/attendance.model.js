const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Attendance', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },

    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    participantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'participants',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    status: { 
      type: DataTypes.ENUM('registered','attended','cancelled'),
      defaultValue: 'registered'
    }
  }, { 
    tableName: 'attendances',
    timestamps: true 
  });
};
