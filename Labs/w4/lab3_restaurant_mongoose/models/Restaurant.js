// const mongoose = require('mongoose');

// const OpeningHourSchema = new mongoose.Schema({
//     dayOfWeek: {
//         type: String,
//         enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//         required: true
//     },
//     // Time is store as minutes (hours * 60 + minutes) for ease of storage and calculation
//     opens: {
//         type: Number,
//         min: 0,
//         max: 1439,
//         required: [true, 'Opening time is required']
//     }, // e.g., 480 (8:00 AM)
//     closes: { 
//         type: Number,
//         min: 0,
//         max: 1439,
//         required: [true, 'Closing time is required']
//     } // e.g., 1320 (10:00 PM)
// })

// const RestaurantSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Restaurant name is required'],
//         lowercase: true,
//         trim: true
//     },
//     unitNumber: {
//         type: String,
//         lowercase: true,
//         trim: true
//     },
//     buildingNumber: {
//         type: String,
//         required: [true, 'Building number is required'],
//         lowercase: true,
//         trim: true
//     },
//     street: {
//         type: String,
//         required: [true, 'Street name is required'],
//         lowercase: true,
//         trim: true
//     },
//     city: {
//         type: String,
//         required: [true, 'City is required'],
//         lowercase: true,
//         trim: true
//     },
//     country: {
//         type: String,
//         required: [true, 'Country is required'],
//         lowercase: true,
//         trim: true
//     },
//     zipCode: {
//         type: String,
//         required: [true, 'Zip code is required'],
//         lowercase: true,
//         trim: true
//     },
//     phone: {
//         type: String,
//         required: [true, 'Phone number is required'],
//         lowercase: true,
//         trim: true,
//         unique: true,
//         match: [/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
//             'Please fill a valid phone number']
//     },
//     email: {
//         type: String,
//         required: [true, "Email is required"],
//         lowercase: true,
//         trim: true,
//         unique: true,
//         match: [/.+\@.+\..+/, "Please fill a valid email address"]
//     },
//     operatingTime: {
//         time: [OpeningHourSchema],
//         required: [true, 'Operating time is required']
//     },
//     cuisine:{
//         type: String,
//         lowercase: true,
//         trim: true
//     },
//     created: {
//         type: Date
//     },
//     updatedAt:{
//         type: Date
//     }
// });

// // Helper Virtual Fields
// RestaurantSchema.virtual('address').get(function() {
//     const unit = this.unitNumber ? `Unit ${this.unitNumber}, ` : '';
    
//     return `${unit}${this.buildingNumber} ${this.street}, ${this.city}, ${this.zipCode}, ${this.country}`
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
// });

// // Middleware
// RestaurantSchema.pre('save', (next)=>{
//     console.log("Before Save")
//     let now = Date.now()

//     this.updatedAt = now
//     if (!this.created){
//         this.created = now
//     }

//     next()
// })

// RestaurantSchema.pre('findOneAndUpdate', (next) => {
//   console.log("Before findOneAndUpdate")
//   let now = Date.now()
//   this.updatedAt = now
//   console.log(this.updatedAt)
//   next()
// });


// RestaurantSchema.post('init', (doc) => {
//   console.log('%s has been initialized from the db', doc._id);
// });

// RestaurantSchema.post('validate', (doc) => {
//   console.log('%s has been validated (but not saved yet)', doc._id);
// });

// RestaurantSchema.post('save', (doc) => {
//   console.log('%s has been saved', doc._id);
// });

// RestaurantSchema.post('remove', (doc) => {
//   console.log('%s has been removed', doc._id);
// });

// const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
// module.exports = Restaurant;


const mongoose = require('mongoose');

// Subdocument schema for address
const AddressSchema = new mongoose.Schema({
    building: {
        type: String,
        required: false 
    },
    street: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        default: null 
    }
}, { _id: false }); 


// Main Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
    address: {
        type: AddressSchema,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    cuisine: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    restaurant_id: {
        type: String,
        required: true,
        unique: true
    },
    create: {type: Date},
    updatedAt: {type: Date}

});
RestaurantSchema.set('toJSON', { virtuals: true });
RestaurantSchema.set('toObject', { virtuals: true });

// Helper Virtual Fields
RestaurantSchema.virtual('fullAddress').get(function () {
  const unit = this.unitNumber ? `Unit ${this.unitNumber}, ` : '';
  const bld = this.address?.building || '';
  const str = this.address?.street || '';
  const zip = this.address?.zipcode || '';
  const city = this.city || '';
  const country = this.country || '';

  return `${unit}${bld} ${str}, ${city}, ${zip}, ${country}`
    .split(' ')
    .filter(word => word.length > 0) // Clean up extra spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

// Middleware
RestaurantSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.isNew) this.created = Date.now();
  next();
});

RestaurantSchema.pre('findOneAndUpdate', function (next) {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedAt = now
  console.log(this.updatedAt)
  next()
});


RestaurantSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

RestaurantSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

RestaurantSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

RestaurantSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
