import { Resolver } from '@nestjs/graphql';

import { Sample } from './Entities';
import { ResourceResolver } from '../Utils/Resolver';




@Resolver()
export class SampleResolver extends ResourceResolver( Sample ) {
  // here you can add resource-specific operations
}
