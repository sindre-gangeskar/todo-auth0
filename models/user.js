module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Username: { type: Sequelize.STRING, allowNull: false, unique: true}
    }, { timestamps: false })

    User.associate = function (models) {
        User.hasMany(models.Task);
    }
    return User;
}