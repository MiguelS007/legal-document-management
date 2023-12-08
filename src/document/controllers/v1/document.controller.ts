import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as multer from 'multer';

import { BaseController, CorrelationId } from 'src/common';
import { DocumentService } from '../../services';
import {
  IDataCreateDocumentDto,
  IDataDeleteDocumentDto,
  IDataGetDocumentDto,
  IDataUpdateDocumentDto,
} from '../../interfaces';
import { GetDocumentDto } from 'src/dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/document')
@ApiTags('document')
export class DocumentController extends BaseController {
  constructor(
    private readonly documentService: DocumentService,
    protected readonly logger: Logger,
  ) {
    super(logger);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get document by id',
  })
  @ApiResponse({ status: 200, description: 'Document returned' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentById(
    @CorrelationId('x-correlation-id') correlationId: string,
    @Query('documentId') documentId: string,
  ) {
    return await this.safeExecute(
      async () =>
        await this.documentService.getDocumentById({
          correlationId,
          documentId,
        }),
      correlationId,
    );
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Get all documents',
  })
  @ApiResponse({ status: 200, description: 'Documents returned' })
  @ApiResponse({ status: 404, description: 'Documents not found' })
  async getAllDocuments(
    @CorrelationId('x-correlation-id') correlationId: string,
  ) {
    return await this.safeExecute(
      async () =>
        await this.documentService.getAllDocuments({
          correlationId,
        }),
      correlationId,
    );
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Create document',
  })
  @ApiResponse({ status: 200, description: 'Document created' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async createDocument(
    @CorrelationId('x-correlation-id') correlationId: string,
    @UploadedFile() file: multer.Multer.File,
  ) {
    return await this.safeExecute(
      async () =>
        await this.documentService.uploadFile({
          correlationId,
          file,
        }),
      correlationId,
    );
  }

  @Put('/update')
  @ApiOperation({
    summary: 'Update document by id',
  })
  @ApiResponse({ status: 200, description: 'Document updated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocument(
    @Body() dataUpdateDocuments: IDataUpdateDocumentDto,
    @CorrelationId('x-correlation-id') correlationId: string,
  ) {
    return await this.safeExecute(
      async () =>
        await this.documentService.updateDocument({
          correlationId,
          dataUpdateDocuments,
        }),
      correlationId,
    );
  }

  @Delete('/delete')
  @ApiOperation({
    summary: 'Delete document by id',
  })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Body() dataDeleteDocuments: IDataDeleteDocumentDto,
    @CorrelationId('x-correlation-id') correlationId: string,
  ) {
    return await this.safeExecute(
      async () =>
        await this.documentService.deleteDocument({
          correlationId,
          dataDeleteDocuments,
        }),
      correlationId,
    );
  }
}
