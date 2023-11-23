import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
  ) {}

  async getPopularTags(): Promise<TagEntity[]> {
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin(
        'articles_tags_tags',
        'articleToArticleTag',
        'tag.id = articleToArticleTag.tagId',
      )
      .groupBy('tag.name')
      .having('COUNT(*) > 1')
      .orderBy('COUNT(*)', 'DESC')
      .limit(5)
      .select('tag.name', 'name')
      .getRawMany();

    return tags;
  }

  async upsertTags(tagList: string[]): Promise<TagEntity[]> {
    await this.tagRepository.upsert(
      tagList.map((name) => ({ name })),
      { skipUpdateIfNoValuesChanged: true, conflictPaths: { name: true } },
    );
    return this.tagRepository.find({ where: { name: In(tagList) } });
  }

  async buildTagsResponse(tags: TagEntity[]) {
    return { tags: tags.map((tag) => tag.name) };
  }
}
