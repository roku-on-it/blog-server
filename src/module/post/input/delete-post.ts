import { DeleteModel } from 'src/module/shared/input/delete-model';
import { InputType } from '@nestjs/graphql';

@InputType()
export class DeletePost extends DeleteModel {}
