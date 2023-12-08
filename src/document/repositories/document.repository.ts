import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MyDocumentModel } from 'src/mongo/models/document.model';
import * as multer from 'multer';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectModel(MyDocumentModel.name)
    private documentModel: Model<MyDocumentModel>,
  ) {}

  async saveFile(file: multer.Multer.File): Promise<MyDocumentModel> {
    const createdDocument = new this.documentModel({
      filename: file.filename,
      originalname: file.originalname,
    });

    return createdDocument.save();
  }
}
