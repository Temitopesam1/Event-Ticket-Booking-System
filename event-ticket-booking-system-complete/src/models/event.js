module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    venue: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    totalTickets: { type: DataTypes.INTEGER, allowNull: false },
    availableTickets: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  Event.associate = models => {
    Event.hasMany(models.Booking, { foreignKey: 'eventId' });
    Event.hasMany(models.WaitingList, { foreignKey: 'eventId' });
  };
  return Event;
};
