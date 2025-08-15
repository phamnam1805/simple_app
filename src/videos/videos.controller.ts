import {
    Controller,
    FileTypeValidator,
    Get,
    Param,
    ParseFilePipe,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response, Express } from 'express';
import 'multer';

@Controller('videos')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('video', { limits: { fileSize: 1073741824 } }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    format: 'binary',
                    description: 'Video file (mp4, mkv, avi)',
                },
            },
        },
    })
    async uploadVideo(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: '.(mp4|mkv|avi)' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return await this.videosService.uploadVideo(file);
    }

    @Get()
    async getAllVideos() {
        return await this.videosService.getAllVideos();
    }

    @Get(':id/stream')
    async streamVideo(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const range = req.headers.range;
        return await this.videosService.streamVideo(id, req, res, range);
    }

    @Get(':id/download')
    async downloadVideo(@Param('id') id: string, @Res() res: Response) {
        return await this.videosService.downloadVideo(id, res);
    }
}
