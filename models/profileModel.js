import mongoose from "mongoose";


const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
    bio: {
        type: String,
        maxlength: 500,
        },
    profilePicture: {
        type: String,
        default: "defaultProfilePic.jpg",
        },
    socialLinks: {
        twitter: {
            type: String,
            maxlength: 100,
        },
        linkedin: {
            type: String,
            maxlength: 100,
        },
        github: {
            type: String,
            maxlength: 100,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    interests : {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <= 10; // Limit : 10 interests
            },
            message: "You can only have up to 10 interests."
        }
    },
    workingExperience: {
        type: [{
            company: { type: String, maxlength: 100 },
            position: { type: String, maxlength: 100 },
            startDate: { type: Date },
            stillworking: { type: Boolean, default: false },
            endDate: { 
            type: Date,
            validate: {
                validator: function(value) {
                    return this.stillworking ? !value : true;
                },
                message: "End date should be empty if still working."
            }
        },
            description: { type: String, maxlength: 500 }
        }],
        default: []
    }

});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
