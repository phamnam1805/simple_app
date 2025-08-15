import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Video } from './videos.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('VideosController', () => {
    let controller: VideosController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VideosController],
            providers: [
                VideosService,
                {
                    provide: getModelToken(Video.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findOneAndUpdate: jest.fn(),
                        findOneAndDelete: jest.fn(),
                        save: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<VideosController>(VideosController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
