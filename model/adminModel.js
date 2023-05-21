const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: { type: String, required: true },
  //   userName:{type:String, }
  phone: [{ type: String, required: true, unique: true }],
  createdAt: { type: Date, default: Date.now() },
});

adminSchema.pre("save", function (next) {
  this.slug = this.name.toLocaleLowerCase().replace(" ", ".");
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;