/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Dropping the "ShowEmail" column from the "Reports" table
        await queryInterface.removeColumn('Reports', 'ShowEmail');
        await queryInterface.removeColumn('Reports', 'IsPublic');
        await queryInterface.removeColumn('Reports', 'Novel');
    
    
        // Adding columns to the "Users" table
        await queryInterface.addColumn('Users', 'Remaining', {
          type: Sequelize.SMALLINT,
          allowNull: false,
          defaultValue: 3
        });
        await queryInterface.addColumn('Users', 'IsAdmin', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        await queryInterface.addColumn('Users', 'IsUnlimited', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
    
        // Adding columns to the "Reports" table
        await queryInterface.addColumn('Reports', 'IsDebug', {
          type: Sequelize.BOOLEAN,
          allowNull: true, // This column is nullable
        });
        await queryInterface.addColumn('Reports', 'IsViable', {
            type: Sequelize.BOOLEAN,
            allowNull: true, // This column is nullable
        });
        await queryInterface.addColumn('Reports', 'IsProcessing', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        await queryInterface.addColumn('Reports', 'Processor', {
            type: Sequelize.SMALLINT,
            allowNull: false,
            defaultValue: 1
          });

        // Adding B-Tree indexes to the "Reports" table
        await queryInterface.addIndex('Reports', ['Flagged'], {
            type: 'BTREE',
            name: 'reports_is_flagged_idx'
        });
        await queryInterface.addIndex('Reports', ['IsReady'], {
            type: 'BTREE',
            name: 'reports_is_ready_idx'
        });
        await queryInterface.addIndex('Reports', ['IsProcessing'], {
            type: 'BTREE',
            name: 'reports_is_processing_idx'
      });
      },
    
      async down(queryInterface, Sequelize) {
        // Reverting the "Reports" table changes
        await queryInterface.addColumn('Reports', 'ShowEmail', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        await queryInterface.addColumn('Reports', 'IsPublic', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        await queryInterface.addColumn('Reports', 'Novel', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        });
        await queryInterface.removeColumn('Reports', 'IsDebug');
        await queryInterface.removeColumn('Reports', 'IsViable');
        await queryInterface.removeColumn('Reports', 'Processor');
        await queryInterface.removeColumn('Reports', 'IsProcessing');
    
        // Removing B-Tree indexes from the "Reports" table
        await queryInterface.removeIndex('Reports', 'reports_is_flagged_idx');
        await queryInterface.removeIndex('Reports', 'reports_is_ready_idx');
        await queryInterface.removeIndex('Reports', 'reports_is_processing_idx');

        // Reverting the "Users" table changes
        await queryInterface.removeColumn('Users', 'Remaining');
        await queryInterface.removeColumn('Users', 'IsAdmin');
        await queryInterface.removeColumn('Users', 'IsUnlimited');
      }
};