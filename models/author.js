const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const {DateTime} = require("luxon");

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});


// Virtual for author's date of birth
AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  if(this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd");
  }else{
    return "";
  }
});

// Virtual for author's date of death
AuthorSchema.virtual("date_of_death_formatted").get(function () {
  if(this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-MM-dd");
  }else{
    return "";
  }
});


AuthorSchema.virtual("lifespan").get(function () {
  let birthToDeath = "";

  if(this.date_of_death && this.date_of_birth) {
    birthToDeath = birthToDeath.concat(`${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)}`)
  } else if(this.date_of_birth) {
    const birth = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    birthToDeath = birthToDeath.concat(`${birth}, age ${Math.floor(DateTime.now().diff(DateTime.fromJSDate(this.date_of_birth), 'years').years)}`)
  } else{
    birthToDeath = "unkown"
  }

  return birthToDeath;  
});


// Export model
module.exports = mongoose.model("Author", AuthorSchema);
