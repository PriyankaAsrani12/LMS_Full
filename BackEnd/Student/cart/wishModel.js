const {DataTypes}=require("sequelize")
const { db } = require('../../common/db/sql');

const WishModel=db.define("wish_table",{
    wish_item_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
    },
    student_id: {
        type: DataTypes.INTEGER,
            references: {
                model: 'student_tables',
                key:'student_id'
          }
      },
      session_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'session_tables',
            key:'session_id'
        }
      },

},{
    timestamps: true
})

db.sync();
module.exports =WishModel;