import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype == 'video/mp4') return cb(null, true);
  cb(new Error('Invalid mime type, only mp4'));
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(400).json({ message: err.message });
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  // console.log();
  res.send('Anashex');
});

app.get('/uploads', (req, res) => {
  fs.readdir(path.join(__dirname, '../public/uploads'), (err, files) => {
    if (err) res.send('error');
    res.send(files);
  });
});

app.use(errorHandler);

app.listen(5001, () => {
  console.log('Server listening...');
});
