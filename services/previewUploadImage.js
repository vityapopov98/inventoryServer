import { unlink } from 'fs';

function previewUploadImage(req, res){
    res.json({status: 'ok', image: 'http://localhost:3000/'+req.file.path})
}

function deletePreviewImage(req, res){

    unlink(req.query.file, (err) => {
      if (err) {
          console.log('deleting error: ', err)
          res.json({status: err})
          return
      }
      console.log('successfully deleted /tmp/hello');
      res.json({status: 'ok'})
    });
}

export {
    previewUploadImage, 
    deletePreviewImage
}