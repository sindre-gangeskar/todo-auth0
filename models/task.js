module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('Task', {
        Name: { type: Sequelize.STRING, allowNull: false },
        Deadline: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate: {
                checkDate: function () {
                    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
                    if (!dateRegex.test(this.Deadline))
                        throw new Error('Invalid date format');
                },
                isNotPast: function () {
                    if (new Date(this.Deadline) < new Date()) {
                        throw new Error('Deadline cannot be in the past');
                    }
                }
            }
        },
        Points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },

    }, { timestamps: false });

    Task.associate = function (models) {
        Task.belongsTo(models.User, { foreignKey: 'UserId' });
    };

    return Task;
};