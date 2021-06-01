import { InputType } from '@nestjs/graphql';
import { DeleteModel } from 'src/module/shared/input/delete-model';

@InputType()
export class DeleteUser extends DeleteModel {}
