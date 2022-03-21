const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema (
  {
    thoughtText: { 
      type: String, 
      required: true,
      minLength: 1,
      maxLength: 280 
    },
    createdAt: { 
      type: Date, 
      default: Date.now()
    },
    username: {
      type: String,
      required: true
    },
    reactions: [
      {
        reactionId: Schema.Types.ObjectId,
        reactionBody: {
          type: String,
          required: true,
          maxlength: 280
        },
        username: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;