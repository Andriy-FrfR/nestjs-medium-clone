import { Controller, Get } from '@nestjs/common';

import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getPopularTags() {
    const tags = await this.tagService.getPopularTags();
    return this.tagService.buildTagsResponse(tags);
  }
}
