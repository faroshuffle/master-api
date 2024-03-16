import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'streamifier';

@Injectable()
export class UploadService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      secure: true,
      cloud_name: configService.get('cloudinary_name'),
      api_key: configService.get('cloudinary_public'),
      api_secret: configService.get('cloudinary_private'),
    });
  }

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        { folder: 'test' },
        function (error, result) {
          resolve(result.url);
        },
      );

      createReadStream(file.buffer).pipe(cld_upload_stream);
    });
  }
}
