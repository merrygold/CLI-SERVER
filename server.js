const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path')
const fs = require('fs')
const app = express();
const port = 3000;


// Apply the CORS middleware with your configuration
app.use(cors()); // Apply the CORS middleware


//* For Local Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'draw-chart'));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({storage});


//*? Route for handling file uploads with format validation using (local-File-Syestem)
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const { originalname, mimetype } = req.file;
    const allowedExtensions = ['.csv'];
    const fileExtension = path.extname(originalname).toLowerCase();

    if (mimetype === 'text/csv' && allowedExtensions.includes(fileExtension)) {
      res.status(200).json({ message: `${originalname} has been uploaded successfully.` });
    } else {
      const filePath = path.join(__dirname, 'draw-chart', req.file.filename);
      fs.unlinkSync(filePath);
      res.status(400).json({ message: 'Invalid file format. Only CSV files are allowed.' });
    }
  } else {
    res.status(400).json({ message: 'No file uploaded.' });
  }
});


// * Serve uploaded files using (local-File-Syestem)
app.get('/draw-chart/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'draw-chart', filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, return a 404 response
      return res.status(404).json({ message: 'File not found.' });
    }

    // Read the file content
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Handle any error that occurred while reading the file
        return res.status(500).json({ message: 'Internal server error.' });
      }

      // Set the response headers to indicate the file type (e.g., CSV)
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Send the file content in the response
      res.send(data);
    });
  });
});


// * Delete the file requires a {filename} using (local-File-Syestem)
app.delete('/delete-file/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'draw-chart', filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, return a 404 response
      return res.status(404).json({ message: 'File not found.' });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        // Handle any error that occurred while deleting the file
        return res.status(500).json({ message: 'Internal server error.' });
      }

      // File deleted successfully
      res.status(200).json({ message: 'File deleted successfully.' });
    });
  });
});


// * Basic Server Check
app.get('/', (req, res) => {
  res.send('CLI backend Server is Ready.....');
});


// * Basic Server Port Check on Console
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



