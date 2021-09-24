import aws from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';

export type FileType = {
  name: string;
  path: string;
  type: string;
};

export type ReturnType = {
  key: string;
  url: string;
};

export default async function upload(file: FileType): Promise<ReturnType> {
  aws.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
  });

  const Bucket = 'image.dnkdream.com';

  return new Promise((resolve, reject) => {
    const Body = fs.createReadStream(file.path);
    const time = `${moment().format('YYMMDD_HHmmss')}`;
    const Key = `${time}_${file.name.trim()}`;

    Body.on('error', function (err) {
      reject(err);
    });

    s3.upload(
      {
        Bucket,
        Body,
        Key,
        ContentType: file.type,
      },
      (err: Error, data: aws.S3.ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve({
            key: data.Key,
            url: data.Location,
          });
        }
      }
    );
  });
}
