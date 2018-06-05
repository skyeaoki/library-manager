'use strict';

module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [1, 64],
          msg: 'Title required'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [3, 64],
          msg: 'Author must be atleast 3 characters'
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      validate: {
        len: {
          args: [3, 64],
          msg: 'Genre must be atleast 3 characters'
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        is4Digits: function(value) {
          if(value.length != 4) {
            throw new Error('Please enter a date in format: YYYY')
          }
        },
        isANumber: function(value) {
          let parsedValue = parseInt(value);
          if(typeof parsedValue != 'number' && value != '') {
            throw new Error('Please enter a date in format: YYYY')
          }
        },
        not: {
          args: ["[a-z]"],
          msg: 'Please enter a date in format: YYYY'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });
  Book.associate = models => {
    // associations can be defined here
    Book.hasOne(models.Loan);
  };
  return Book;
};
