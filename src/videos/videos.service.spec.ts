import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Video } from './videos.schema';

describe('VideosService', () => {
    let service: VideosService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<VideosService>(VideosService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
