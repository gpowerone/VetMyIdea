/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Dropping the "ShowEmail" column from the "Reports" table
        await queryInterface.removeColumn('Reports', 'Processor');

        await queryInterface.addColumn('Reports', 'IsDelayed', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        });

        // Adding B-Tree indexes to the "Reports" table
        await queryInterface.addIndex('Reports', ['IsDelayed'], {
            type: 'BTREE',
            name: 'reports_is_delayed_idx'
        });
      
      },
    
      async down(queryInterface, Sequelize) {
        // Reverting the "Reports" table changes
        await queryInterface.addColumn('Reports', 'Processor', {
            type: Sequelize.SMALLINT,
            allowNull: false,
            defaultValue: 1
        });
  
        await queryInterface.removeColumn('Reports', 'IsDelayed');

        // Removing B-Tree indexes from the "Reports" table
        await queryInterface.removeIndex('Reports', 'reports_is_delayed_idx');


     
      }
};