class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async create(username) {
        return await this.User.create({Username: username});
    }
    async getAll() {
        return await this.User.findAll();
    }
    async getOneById(id) {
        return await this.User.findOne({ where: { id: id } });
    }
    async getOneByName(username) {
        return await this.User.findOne({ where: { username: username } });
    }
    async destroy(id) {
        await this.User.destroy({ where: { id: id } });
    }
}

module.exports = UserService;