import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MyDocumentModel extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const MyDocumentSchema = SchemaFactory.createForClass(MyDocumentModel);
