import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from './prisma.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  async getCacheValue(key: string) {
    const value = await this.cacheManager.get(key);
    if (!value) {
      const keys = await this.prismaService.wooCommerceKeys.findFirst({
        where: { merchant: { id: parseInt(key) } },
      });

      if (!keys) {
        return false;
      }

      await this.storeCache(key, {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey,
      });
    }

    return this.cacheManager.get(key);
  }

  async storeCache(key: string, value: unknown) {
    await this.cacheManager.set(key, value, 0);
  }

  async removeCache(key: string) {
    await this.cacheManager.del(key);
  }
}
