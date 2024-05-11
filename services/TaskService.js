class TaskService {
    constructor(db) {
        this.client = db.sequelize;
        this.Task = db.Task;
    }

    async create(username, name, points, deadline, userId) {
        return await this.Task.create({ Username: username, Name: name, Points: points, Deadline: deadline, UserId: userId  });
    }
    async getAll() {
        return await this.Task.findAll();
    }
    async getByUsername(username) {
        return await this.Task.find({ where: { Username: username } });
    }
    async getById(userId) {
        return await this.Task.findOne({ where: { UserId: userId } });
    }
    async destroy(id) {
        await this.Task.destroy({ where: { id: id } });
    }
}

module.exports = TaskService;