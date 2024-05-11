class TaskService {
    constructor(db) {
        this.client = db.sequelize;
        this.Task = db.Task;
    }

    async create(username, name, points) {
        return await this.create({ where: { username: username, name: name, points: points } });
    }
    async getAll() {
        return await this.findAll({ where: {} });
    }
    async getByUsername(username) {
        return await this.findAll({ where: { username: username } });
    }
    async getById(userId) {
        return await this.findAll({ where: { userId: userId } });
    }
    async destroy(id) {
        await this.destroy({ where: { id: id } });
    }
}

return TaskService;