import sequelize from './index.js'
import { DataTypes, Model } from 'sequelize';

class Report extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Report.hasMany(models.ReportField, {
        foreignKey: { name: 'ReportID', allowNull: false},
        onDelete: 'CASCADE'
    });
  }
}
Report.init({
    ReportID: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
    },
    UserID: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    BusinessType: {
        allowNull: true,
        type: DataTypes.STRING(24),
    },
    ProductType: {
        allowNull: false,
        type: DataTypes.STRING(255),
        validate: {
            len: {
                args: [1,255],
                msg: "Product type must be between 1 and 255 characters"
            }
        }
    },
    Money: {
        allowNull: true,
        type: DataTypes.FLOAT,
    },
    Score: {
        allowNull: true,
        type: DataTypes.SMALLINT,
    },
    TargetLocation: {
        allowNull: false,
        type: DataTypes.STRING(255),
    },
    Flagged: {
        allowNull: false,
        default: false,
        type: DataTypes.BOOLEAN
    },
    IsFranchise: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    IsPlatform: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    IsDebug: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    IsViable: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    IsReady: {
        allowNull: false,
        default: false,
        type: DataTypes.BOOLEAN
    },
    IsProcessing: {
        allowNull: false,
        default: false,
        type: DataTypes.BOOLEAN
    },
    IsDelayed: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    }

}, {
  sequelize,
  modelName: 'Report',
});
  
export default Report