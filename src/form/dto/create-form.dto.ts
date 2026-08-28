import { Form } from '../../../generated/prisma';

export class CreateFormDto implements Pick<Form, 'name' | 'description'> {
  name!: string;
  description!: string | null;
}
