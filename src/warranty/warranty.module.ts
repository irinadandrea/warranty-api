import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WarrantyController } from './warranty.controller';
import { WarrantyService } from './warranty.service';

@Module({
  imports: [AuthModule],
  controllers: [WarrantyController],
  providers: [WarrantyService],
})
export class WarrantyModule {}