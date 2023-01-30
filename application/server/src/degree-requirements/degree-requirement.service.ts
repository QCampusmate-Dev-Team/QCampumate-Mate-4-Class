import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { DegreeRequirement } from './degree-requirement.entity'
 
@Injectable()
export class DegreeRequirementService {
  constructor(@InjectRepository(DegreeRequirement) private repo:   Repository<DegreeRequirement>) { // @InjectRepository is needed for inject a dependency of generic type. Regard as a temporary hack 
    
  }
}
