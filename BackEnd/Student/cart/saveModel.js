const {DataTypes}=require("sequelize")
const { db } = require('../../common/db/sql');

const SaveModel=db.define("save_table",{
    save_item_id:{
        type:DataTypes.INTEGER(11),
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
module.exports =SaveModel;