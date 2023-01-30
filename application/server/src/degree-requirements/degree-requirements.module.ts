import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeRequirementController } from './degree-requirement.controller';
import { DegreeRequirementService } from './degree-requirement.service';
import { DegreeRequirement } from './degree-requirement.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DegreeRequirement])],
  controllers: [DegreeRequirementController],
  providers: [DegreeRequirementService]
})
export class DegreeRequirementModule {}
