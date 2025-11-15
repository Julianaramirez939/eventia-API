const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Participant', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'participants', timestamps: true });
};
