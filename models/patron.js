'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [1, 64],
          msg: 'First name required'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [1, 64],
          msg: 'Last name required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [6, 64],
          msg: 'Address must be atleast 6 characters long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [4, 64],
          msg: 'Email must be atleast 4 characters long'
        },
        isEmail: {
          args: true,
          msg: 'Please enter a valid email'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [1, 64],
          msg: 'Library id required'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [5,5],
          msg: 'Please enter a 5 digit zip code'
        },
        isInt: {
          args: true,
          msg: 'Please enter a 5 digit zip code'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Patron.associate = function(models) {
    // associations can be defined here
    Patron.hasMany(models.Loan);
  };
  return Patron;
};
