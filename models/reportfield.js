import sequelize from './index.js'
import { DataTypes, Model } from 'sequelize';

class ReportField extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {}
}
ReportField.init({
    ReportFieldID: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
    },
    ReportID: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    FieldType: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    FieldValue: {
        allowNull: false,
        type: DataTypes.TEXT
    }
}, {
  sequelize,
  modelName: 'ReportField',
});
  
export default ReportField