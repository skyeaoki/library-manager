'use strict';

module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    loaned_on: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [10,64],
          msg: 'Please enter a date in format: YYYY-MM-DD'
        },
        isDate: {
          args: true,
          msg: 'Please enter a valid date in format: YYYY-MM-DD'
        }
      }
    },
    return_by: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [10,64],
          msg: 'Please enter a date in format: YYYY-MM-DD'
        },
        isDate: {
          args: true,
          msg: 'Please enter a valid date in format: YYYY-MM-DD'
        }
      }
    },
    returned_on: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [10,64],
          msg: 'Please enter a date in format: YYYY-MM-DD'
        },
        isDate: {
          args: true,
          msg: 'Please enter a valid date in format: YYYY-MM-DD!'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Book, { foreignKey: "book_id" });
    Loan.belongsTo(models.Patron,  { foreignKey: "patron_id" });
  };
  return Loan;
};
