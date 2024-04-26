/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn('Reports', 'BusinessType', {
            type: Sequelize.STRING,
            allowNull: true,
            default: 'online'
        });

        await queryInterface.addColumn('Reports', 'Money', {
            type: Sequelize.FLOAT,
            allowNull: true,
            default: 0
        });

  
      },
    
      async down(queryInterface, Sequelize) {
        // Reverting the "Reports" table changes
        await queryInterface.removeColumn('Reports', 'BusinessType');
        await queryInterface.removeColumn('Reports', 'Money');


      }
};