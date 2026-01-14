const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;
// Hey GitHub Copilot
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});
// add another endpoint for deleting a comment
router.delete("/:id", (req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to delete comment" });
    });
});
