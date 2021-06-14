import { UpdateUser } from 'src/module/user/input/update-user';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateMe extends OmitType(UpdateUser, ['id', 'role']) {}
