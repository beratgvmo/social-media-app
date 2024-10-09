import { Controller } from '@nestjs/common';
import { PostImagesService } from './post-images.service';

@Controller('post-images')
export class PostImagesController {
    constructor(private readonly postImagesService: PostImagesService) {}
}
