import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  key: string;
  @Prop({ required: true })
location: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  creator: Types.ObjectId;
}

export const FileSchema = SchemaFactory.createForClass(File);
