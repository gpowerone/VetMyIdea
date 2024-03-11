/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('Users', {
        UserID: {
          allowNull: false,
          type: Sequelize.UUID,
          primaryKey: true,
          onDelete: 'CASCADE'
        },
        Username: {
          allowNull: false,
          type: Sequelize.STRING(32),
          unique: true
        }, 
        AuthSource: {
            allowNull: false,
            type: Sequelize.STRING(16)
        },  
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
      await queryInterface.createTable('Reports', {
        ReportID: {
            allowNull: false,
            type: Sequelize.UUID,
            primaryKey: true,
            onDelete: 'CASCADE'
        },
        UserID: {
            allowNull: false,
            type: Sequelize.UUID,
            references: { model: 'Users', key: 'UserID'} 
        },
        ProductType: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        Score: {
            allowNull: true,
            type: Sequelize.SMALLINT
        },
        TargetLocation: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        IsPublic: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        Flagged: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        Novel: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        ShowEmail: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        IsReady: {
            allowNull: false,
            default: false,
            type: Sequelize.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
      await queryInterface.addIndex('Reports', ['UserID'], {
        name: 'idx_report_user'
      });
      await queryInterface.createTable('ReportFields', {
        ReportFieldID: {
            allowNull: false,
            type: Sequelize.UUID,
            primaryKey: true
        },
        ReportID: {
            allowNull: false,
            type: Sequelize.UUID,
            references: { model: 'Reports', key: 'ReportID'} 
        },
        FieldType: {
            allowNull: false,
            type: Sequelize.STRING
        },
        FieldValue: {
            allowNull: false,
            type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
      await queryInterface.addIndex('ReportFields', ['ReportID'], {
        name: 'idx_reportfield_report'
      });
      await queryInterface.createTable('Sessions', {
        SessionID: {
          allowNull: false,
          type: Sequelize.UUID,
          primaryKey: true
        },
        Token: {
          allowNull: false,
          type: Sequelize.STRING(255)     
        },
        UserID: {
          allowNull: false,
          type: Sequelize.UUID,
          references: { model: 'Users', key: 'UserID'} 
        },
        UserFirstName: {
          allowNull: false,
          type: Sequelize.STRING(128)
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
      await queryInterface.addIndex('Sessions', ['UserID'], {
        name: 'idx_session_user'
      });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Sessions', 'idx_session_user');
        await queryInterface.removeIndex('ReportFields', 'idx_reportfield_report');
        await queryInterface.removeIndex('Reports', 'idx_report_user');
        await queryInterface.dropTable('Sessions');
        await queryInterface.dropTable('ReportFields');
        await queryInterface.dropTable('Reports');
        await queryInterface.dropTable('Users');
    }
}