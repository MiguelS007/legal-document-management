import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyDocumentModel, MyDocumentSchema } from './models/document.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs-mongodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([
      { name: MyDocumentModel.name, schema: MyDocumentSchema },
    ]),
  ],
  providers: [MyDocumentModel],
})
export class MongoModule {}
