import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ versionKey: false })
export class Video {
    @Prop({ required: true, unique: true, index: true })
    id: string;

    @Prop({ required: true })
    extension: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
