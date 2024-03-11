import Sequelize from 'sequelize';
const env = process.env.NODE_ENV || 'development';
import config from '../config/dbconfig.js'

export default new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);