import { IsString } from 'class-validator';

export class GetDocumentDto {
  @IsString()
  readonly documentId: string;
}
