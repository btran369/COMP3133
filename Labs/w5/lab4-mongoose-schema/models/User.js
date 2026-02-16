const mongoose = require("mongoose");

// Strict http/https URL
const httpUrlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

// Strict DDDDD-DDDD (no 5-digit-only)
const zipRegex = /^\d{5}-\d{4}$/;

// D-DDD-DDD-DDDD
const phoneRegex = /^\d-\d{3}-\d{3}-\d{4}$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },

  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "Username must be at least 4 letters long"],
    maxlength: [100, "Username must be at most 100 letters long"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: true, // creates a unique index (make sure indexes are built)
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },

  address: {
    street: { type: String, required: [true, "Street is required"], trim: true },
    suite:  { type: String, required: [true, "Suite is required"], trim: true },

    city: {
      type: String,
      required: [true, "City is required"],
      match: [/^[a-zA-Z\s]+$/, "Please fill a valid city name"],
      lowercase: true,
      trim: true
    },

    zipcode: {
      type: String,
      required: [true, "Zipcode is required"],
      trim: true,
      match: [zipRegex, "Please enter zip code in format DDDDD-DDDD. EX: 12345-6789"]
    },

    geo: {
      lat: { type: String, required: [true, "Geo lat is required"], trim: true },
      lng: { type: String, required: [true, "Geo lng is required"], trim: true }
    }
  },

  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
    match: [phoneRegex, "Please enter phone number in format D-DDD-DDD-DDDD. Ex: 1-234-567-8901"]
  },

  website: {
    type: String,
    required: [true, "Website is required"],
    trim: true,
    match: [httpUrlRegex, "Please enter a valid http/https URL (e.g., https://example.com)"]
  },

  company: {
    name:       { type: String, required: [true, "Company name is required"], trim: true },
    catchPhrase:{ type: String, required: [true, "Catch phrase is required"], trim: true },
    bs:         { type: String, required: [true, "BS is required"], trim: true }
  },

  created: { type: Date },
  updatedAt: { type: Date }
});

UserSchema.pre("save", function (next) {
  console.log("Before Save");
  const now = Date.now();

  this.updatedAt = now;
  if (!this.created) this.created = now;

  next();
});

UserSchema.post("init", (doc) => {
  console.log("%s has been initialized from the db", doc._id);
});
UserSchema.post("validate", (doc) => {
  console.log("%s has been validated (but not saved yet)", doc._id);
});
UserSchema.post("save", (doc) => {
  console.log("%s has been saved", doc._id);
});
UserSchema.post("remove", (doc) => {
  console.log("%s has been removed", doc._id);
});

module.exports = mongoose.model("User", UserSchema);
