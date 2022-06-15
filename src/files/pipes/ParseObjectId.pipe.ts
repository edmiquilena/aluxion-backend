import { PipeTransform, Injectable, BadRequestException } from 
'@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any,Types.ObjectId> {

public transform(value: any): Types.ObjectId {
try {
if(Types.ObjectId.isValid(value))   return value 
throw new BadRequestException('ObjectId is expected');
  
} catch (error) {
  throw new BadRequestException('ObjectId is expected');
}
}
}