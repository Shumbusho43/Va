var mongoose  =  require('mongoose');  
   
var excelSchema = new mongoose.Schema({  
    names:{  
        type:String  
    }
});  
   
module.exports.allNames = mongoose.model('allNames',excelSchema); 