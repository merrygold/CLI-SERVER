const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;
const {S3Client , PutObjectCommand ,GetObjectCommand ,DeleteObjectCommand } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')


// Enable CORS for specific origins (in this case, 'https://cli-repl.vercel.app')


// Apply the CORS middleware with your configuration


app.use(cors({ origin: 'https://cli-repl.vercel.app/'})); // Apply the CORS middleware


dotenv.config();

// * Set up Multer with the storage
const storage = multer.memoryStorage();
const upload = multer({storage});


// *! CloudFlare Credentials
const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});


//* For Uploading the File on Cloudflare Storage

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    await S3.send(
      new PutObjectCommand({
        Body: req.file.buffer,
        Bucket: 'cli-storage',
        Key: req.file.originalname,
        ContentType: req.file.mimetype,
      })
    );
   res.send('File Upload');
    //  return res.status(200).json({ message: `File "${req.file.originalname}" uploaded successfully.` });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error');
  }
});



//* For Accessing the file with {filename} param from the Cloudflare Storage

app.get('/draw-chart/:filename', async (req, res) => {
  const { filename } = req.params; // Get the filename from the route parameters

  console.log(filename)
  try {
    const data = await S3.send(
      new GetObjectCommand({
        Bucket: 'cli-storage', // Replace with your S3 bucket name
        Key: filename, // Use the filename from the route params as the key
      })
    );

    console.log(typeof(data))
  
    
    // Set the appropriate response headers based on the file's metadata
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the file data as the response
  
    data.Body.pipe(res);
  } catch (error) {
    console.error('Error retrieving file from S3:', error);

   
    res.status(500).json({ message: 'Internal server error.' });
  }
});



//* For Delete file with {filename} param on the Cloudflare Storage

app.delete('/delete-file/:filename', async (req, res) => {
  const { filename } = req.params; // Get the filename from the route parameters

  try {
    const deleteParams = {
      Bucket: 'cli-storage', // Replace with your S3 bucket name
      Key: filename, // Use the filename from the route params as the key
    };

    await S3.send(new DeleteObjectCommand(deleteParams));
    
    await res.status(200).json({ message: `File "${filename}" deleted successfully.` });

  
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});




//* For Local Storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'draw-chart'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.originalname}`);
//   },
// });


//*? Route for handling file uploads with format validation using (local-File-Syestem)
// app.post('/upload', upload.single('file'), (req, res) => {
//   // Check if a file was uploaded successfully
//   if (req.file) {
//     const { originalname, mimetype } = req.file;
//     // Check if the uploaded file has the CSV mimetype
//     if (mimetype === 'text/csv') {
//       res.status(200).json({ message: `${originalname} has been uploaded successfully.` });
//     } else {
//       // If the mimetype is not CSV, delete the uploaded file and return an error
//       const filePath = path.join(__dirname, 'draw-chart', req.file.filename);
//       fs.unlinkSync(filePath); // Delete the file
//       res.status(400).json({ message: 'Only CSV files are allowed.' });
//     }
//   } else {
//     res.status(400).json({ message: 'No file uploaded.' });
//   }
// });





// * Serve uploaded files using (local-File-Syestem)
// app.get('/draw-chart/:filename', (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(__dirname, 'draw-chart', filename);

//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // File does not exist, return a 404 response
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     // Read the file content
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         // Handle any error that occurred while reading the file
//         return res.status(500).json({ message: 'Internal server error.' });
//       }

//       // Set the response headers to indicate the file type (e.g., CSV)
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

//       // Send the file content in the response
//       res.send(data);
//     });
//   });
// });


// * Delete the file requires a {filename} using (local-File-Syestem)
// app.delete('/delete-file/:filename', (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(__dirname, 'draw-chart', filename);

//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // File does not exist, return a 404 response
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     // Delete the file
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         // Handle any error that occurred while deleting the file
//         return res.status(500).json({ message: 'Internal server error.' });
//       }

//       // File deleted successfully
//       res.status(200).json({ message: 'File deleted successfully.' });
//     });
//   });
// });



// * Basic Server Check
app.get('/', (req, res) => {
  res.send('CLI backend Server is Ready.....');
});


// * Basic Server Port Check on Console
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



