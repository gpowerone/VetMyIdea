import sequelize from './index.js'
import { DataTypes, Model } from 'sequelize';

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    User.hasMany(models.Report, {
        foreignKey: { name: 'UserID', allowNull: false},
        onDelete: 'CASCADE'
    });
  }
}
User.init({
    UserID: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
    },
    Username: {
        allowNull: false,
        type: DataTypes.STRING(255),
        unique: false,
        validate: {
            len: {
                args: [1,32],
                msg: "Username must be between 1 and 255 characters"
            }
        }
    },
    AuthSource: {
        allowNull: false,
        type: DataTypes.STRING(16)
    },
    Remaining: {
        allowNull: false,
        type: DataTypes.SMALLINT
    },
    IsAdmin: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    },
    IsUnlimited: {
        allowNull: false,
        type: DataTypes.BOOLEAN
    }
}, {
  sequelize,
  modelName: 'User',
});
  
export default User