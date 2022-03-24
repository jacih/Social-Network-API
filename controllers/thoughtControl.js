const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.status(200).json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with such id.' })
        : res.status(200).json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Create a thought - may need to tweak this after seeding
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'No thought created.' })
        : User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        ).select('-__v')
        .then((user) =>
          !user
          ? res.status(404).json({ message: 'Thought created, but no such user exists.' })
          : res.status(200).json({ message: 'Thought created and added to user.' })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);  
        })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with such id' })
        : res.status(200).json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a thought
  removeThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with such id' })
        : User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { runValidators: true, new: true }
        )
      )
      .then((user) => 
        !user
        ? res.status(404).json({ message: 'No such user associated with that thought.' })
        : res.status(200).json({ message: 'Thought removed from user.' }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
   // add a reaction
   addReaction(req,res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with such id.' })
        : res.status(200).json({ message: 'Reaction added to thought.' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // delete a reaction
  deleteReaction(req,res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'No thought found with such id.' })
        : res.status(200).json({ message: 'Reaction deleted from thought.' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
};
