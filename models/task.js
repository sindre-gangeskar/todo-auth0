module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('Task', {
        Name: { type: Sequelize.STRING, allowNull: false },
        Deadline: { type: Sequelize.DATEONLY, allowNull: false },
        Points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            reference: {
                model: 'User',
                key: 'id'
            }
            
        }
    }, { timestamps: false });

    Task.associate = function (models) {
        Task.belongsTo(models.User, {foreignKey: 'UserId'});
    };

    return Task;
};
