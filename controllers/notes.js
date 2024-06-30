

// Controller functions for CRUD operations on notes

const Note = require("../models/Notes");

// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Example middleware to log user information
// exports.logUser = (req, res, next) => {
//     console.log('User:', req.user);
//     next();
// };

// Get notes for a specific user
exports.getUserNotes = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user ID is stored in req.user
        const userNotes = await Note.find({ user: userId });
        res.json(userNotes);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};


// Get a specific note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add a new note with image upload
exports.addNote = async (req, res) => {
    const { title, content } = req.body;
    // const userId = req.user._id;
    const image = req.file ? '/images/' + req.file.filename : undefined; // Save image path

    const newNote = new Note({
        title,
        content,
        image,
        user: req.user.id
    });

    try {
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a note by ID with image upload
exports.updateNote = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? '/images/' + req.file.filename : undefined; // Save image path

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                image,
                lastUpdatedDate: Date.now(),
            },
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.json(deletedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
