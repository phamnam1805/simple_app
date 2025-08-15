import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './videos.schema';
import { Model } from 'mongoose';
import path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { VIDEO_ASSET_PATH } from './videos.constants';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';

@Injectable()
export class VideosService {
    constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}

    async uploadVideo(file: Express.Multer.File) {
        try {
            const fileName = path.parse(file.originalname as string).name;
            const extension = path
                .parse(file.originalname as string)
                .ext.replace('.', '');
            const timestamp = Date.now().toString();
            const videoId = crypto
                .createHash('sha256')
                .update(fileName)
                .update(timestamp)
                .digest('hex');

            const filePath = path.join(
                VIDEO_ASSET_PATH,
                `${videoId}.${extension}`,
            );
            await fs.writeFile(filePath, Buffer.from(file.buffer));

            const video = new this.videoModel({
                id: videoId,
                extension: extension,
            });
            const savedVideo = await video.save();
            return savedVideo;
        } catch (error) {
            throw new Error('Error uploading video');
        }
    }

    async getAllVideos() {
        return await this.videoModel.find().exec();
    }

    async streamVideo(id: string, req: Request, res: Response, range?: string) {
        try {
            const video = await this.videoModel.findOne({ id }).exec();
            if (!video) {
                throw new Error('Video not found');
            }

            const videoPath = path.join(
                VIDEO_ASSET_PATH,
                `${video.id}.${video.extension}`,
            );

            try {
                await fs.access(videoPath);
            } catch {
                throw new NotFoundException('Video file not found');
            }

            const stat = await fs.stat(videoPath);
            const fileSize = stat.size;

            if (range) {
                // Partial content streaming (support for video seeking)
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;

                const file = createReadStream(videoPath, { start, end });

                res.status(206);
                res.set({
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize.toString(),
                    'Content-Type': 'video/mp4',
                });

                file.pipe(res);
            } else {
                res.set({
                    'Content-Length': fileSize.toString(),
                    'Content-Type': 'video/mp4',
                    'Accept-Ranges': 'bytes',
                });

                createReadStream(videoPath).pipe(res);
            }
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            }
            throw new Error('Error streaming video');
        }
    }

    async downloadVideo(id: string, res: Response) {
        try {
            const video = await this.videoModel.findOne({ id }).exec();
            if (!video) {
                throw new NotFoundException('Video not found');
            }

            const videoPath = path.join(
                VIDEO_ASSET_PATH,
                `${video.id}.${video.extension}`,
            );

            try {
                await fs.access(videoPath);
            } catch {
                throw new NotFoundException('Video file not found');
            }

            res.set({
                'Content-Disposition': `attachment; filename="${video.id}.${video.extension}"`,
                'Content-Type': 'video/mp4',
            });

            createReadStream(videoPath).pipe(res);
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            }
            throw new Error('Error downloading video');
        }
    }
}
