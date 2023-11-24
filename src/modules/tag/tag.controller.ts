import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TagService } from './tag.service';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getPopularTags() {
    const tags = await this.tagService.getPopularTags();
    return this.tagService.buildTagsResponse(tags);
  }
}
