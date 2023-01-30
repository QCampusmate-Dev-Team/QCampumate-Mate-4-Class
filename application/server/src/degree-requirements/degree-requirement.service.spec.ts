import { Test, TestingModule } from '@nestjs/testing';
import { DegreeRequirementService } from './degree-requirement.service';

describe('DegreeRequirementService', () => {
  let service: DegreeRequirementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DegreeRequirementService],
    }).compile();

    service = module.get<DegreeRequirementService>(DegreeRequirementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
