import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';

@Injectable()
export class WarrantyService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, createWarrantyDto: CreateWarrantyDto) {
    return this.prisma.warranty.create({
      data: {
        ...createWarrantyDto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.warranty.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(userId: string, id: string) {
    return this.findOwnedWarranty(userId, id);
  }

  async update(
    userId: string,
    id: string,
    updateWarrantyDto: UpdateWarrantyDto,
  ) {
    await this.findOwnedWarranty(userId, id);

    return this.prisma.warranty.update({
      where: { id },
      data: updateWarrantyDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOwnedWarranty(userId, id);

    await this.prisma.warranty.delete({ where: { id } });
  }

  async cleanupExpired(userId: string) {
    const now = new Date();

    const deletedCount = await this.prisma.$transaction(async (transaction) => {
      const expiredWarranties = await transaction.warranty.findMany({
        where: {
          userId,
          expiresAt: { lt: now },
        },
        select: { id: true },
      });

      if (expiredWarranties.length === 0) {
        return 0;
      }

      const result = await transaction.warranty.deleteMany({
        where: {
          userId,
          id: { in: expiredWarranties.map(({ id }) => id) },
        },
      });

      return result.count;
    });

    return { deletedCount };
  }

  private async findOwnedWarranty(userId: string, id: string) {
    const warranty = await this.prisma.warranty.findFirst({
      where: { id, userId },
    });

    if (!warranty) {
      throw new NotFoundException('Warranty not found');
    }

    return warranty;
  }
}