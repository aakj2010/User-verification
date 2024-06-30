const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes');
const multer = require('multer');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images'); // Set the destination folder for image uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
    },
});

const upload = multer({ storage: storage });
// Example middleware to log user information
const logUser = (req, res, next) => {
    if (req.user) {
        console.log('User:', req.user);
        next();
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
};
// Routes for CRUD operations on notes

// Get all notes
router.route('/').get(noteController.getAllNotes);

// Apply the middleware to the relevant route
router.route('/user/:userId').get(logUser, noteController.getUserNotes);

// Get notes for a specific user
// router.route('/user/:userId').get(noteController.getUserNotes);

// Get a specific note by ID
router.route('/:id').get(noteController.getNoteById);

// Add a new note with image upload
router.route('/add').post(upload.single('file'), noteController.addNote);

// Update a note by ID with image upload
router.route('/update/:id').post(upload.single('file'), noteController.updateNote);

// Delete a note by ID
router.route('/delete/:id').delete(noteController.deleteNote);

module.exports = router;
