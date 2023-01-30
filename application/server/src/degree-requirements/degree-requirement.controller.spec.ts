import { Test, TestingModule } from '@nestjs/testing';
import { DegreeRequirementController } from './degree-requirement.controller';

describe('DegreeRequirementController', () => {
  let controller: DegreeRequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreeRequirementController],
    }).compile();

    controller = module.get<DegreeRequirementController>(DegreeRequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
