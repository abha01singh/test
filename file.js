db structure
{
	userId:String,
	password: String,
	firstName: String,
	lastName: String,
	Role:[],
	companyId: []
}

app.get("/api/getUserDetails", function(req,res){
	var resData = [];
	CommonDb.find({_id: req.user}, function(err, user){
		async.each(user.companys, function(companyId, cb){
			//logic to connect user db by company id...
			require('../models/user')(req.companyDb);
            var UserModel = req.companyDb.model('User');
            UserModel.find({companyId: req.companyId, taxfile: false}, function(err, data){
            	resData.push(data);
            });
            cb();
		}, function(err){});
		return res.json(resData);
	});
});