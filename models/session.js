import sequelize from './index.js'
import { DataTypes, Model } from 'sequelize';

class Session extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Session.init({
    SessionID: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
    },
    Token: {
        allowNull: false,
        type: DataTypes.STRING(255)     
    },
    UserID: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    UserFirstName: {
       allowNull: false,
       type: DataTypes.STRING(128)
    }
}, {
  sequelize,
  modelName: 'Session',
});
  
export default Session