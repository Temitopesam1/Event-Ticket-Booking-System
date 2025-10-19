module.exports = (sequelize, DataTypes) => {
  const WaitingList = sequelize.define('WaitingList', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    eventId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
  }, {});
  WaitingList.associate = models => {
    WaitingList.belongsTo(models.Event, { foreignKey: 'eventId' });
  };
  return WaitingList;
};
