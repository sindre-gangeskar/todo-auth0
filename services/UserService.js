class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async create(username, password) {
        return await this.User.create({ where: { username: username, password: password } });
    }
    async getAll() {
        return await this.User.findAll();
    }
    async getOneById(id) {
        return await this.User.find({ where: { id: id } });
    }
    async getOneByName(username) {
        return await this.User.find({ where: { username: username } });
    }
    async destroy(id) {
        await this.User.destroy({ where: { id: id } });
    }
}

return UserService;