var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	userId: { type: String,required: true, unique:true },
	userPassword: { type: String,required: true },
	userName: { type: String,required: true },
	userType: { type: Number,required: true,default: 0}, //0代表用户，1代表发起者
  userProject: { type: Array},
  verifyNum: { type: String },
  verifyAddress: { type: String },
  fortune: { type: Number,required: true },
  projectInitiate: { type: Number, required:true, default: 0},
  address: { type: String,required: true },
  publicKey:  { type: String,required: true }
});

var projectSchema = mongoose.Schema({
	projectStarter: { type: String,required: true },
	projectID: { type: String,required: true },
	projectName: { type: String,required: true },
	projectIntroduce: { type: String,required: true },
	projectImage: { type: String,required: true },
	projectFortune: { type: Number,required: true },
	projectTarget: { type: String,required: true },
	projectcompleted: { type: Number,required: true },
	projectParticipated: { type: Number,required: true },
	projectDate: { type: Array,required: true },
});

var tradeSchema = mongoose.Schema({
  starter: {type: String,required: true},
  receiver: {type: String,required: true},
  timeStamp: {type: Date,required: true,default: Date.now},
  projectId: {type: String,required:true},
  expenditure:{type:Number,required:true},
});

var CashRouteSchema = mongoose.Schema({
  ProjectId: {type: String,required: true},
  RouteName: {type: String, required:true},
  cost: {type: Number, required: true},
  RouteDate: {type: String, required: true},
  starter: {type: String, required: true},
  receiver: {type: String, required: true},
  receiverProve:{type: String, required:true},
  receiverRegister: {type:String, required:true},
  disc:{type:String, required:true}
});

var reviewSchema = mongoose.Schema({
  ProjectId: {type: String,required: true},
  floor: {type:Number,required: true},
  reviewer: {type: String, require: true},
  detail: {type: String,required: true},
  reviewDate: {type: String,require: true}
});


exports.user = mongoose.model('user',userSchema);
exports.project = mongoose.model('project',projectSchema);
exports.trade = mongoose.model('trade',tradeSchema);
exports.cashRoute = mongoose.model('cashRoute',CashRouteSchema);
exports.review = mongoose.model('review',reviewSchema);
