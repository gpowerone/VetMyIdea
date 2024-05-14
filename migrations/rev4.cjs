/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn('Reports', 'IsPlatform', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false
        });

        await queryInterface.addColumn('Reports', 'IsFranchise', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false
        });

        await queryInterface.removeColumn('Reports', 'Score');

  
      },
    
      async down(queryInterface, Sequelize) {
        // Reverting the "Reports" table changes
        await queryInterface.removeColumn('Reports', 'IsPlatform');
        await queryInterface.removeColumn('Reports', 'IsFranchise');

        await queryInterface.addColumn('Reports', 'Score', {
          allowNull: true,
          type: Sequelize.SMALLINT
        });

    }
};