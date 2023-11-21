import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
  ) {}

  async getPopularTags(): Promise<TagEntity[]> {
    // TODO: Add logic to filter most popular tags
    return this.tagRepository.find();
  }

  async buildTagsResponse(tags: TagEntity[]) {
    return { tags: tags.map((tag) => tag.name) };
  }
}
