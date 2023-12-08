import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as multer from 'multer';

// import { AdapterService } from './adapter.service';
import {
  IDataCreateDocumentDto,
  IDataDeleteDocumentDto,
  IDataGetDocumentDto,
  IDataUpdateDocumentDto,
} from '../interfaces';
import {
  PayloadValidator,
  PayloadDocumentByIdValidator,
} from '../../validators';
import { DocumentRepository } from '../repositories';

@Injectable()
export class DocumentService {
  private readonly contextService = DocumentService.name;
  constructor(
    private readonly logger: Logger,
    // private readonly adapterService: AdapterService,
    private readonly documentRepositroy: DocumentRepository,
    private readonly payloadService: PayloadValidator,
  ) {}

  public async getDocumentById({
    correlationId,
    documentId,
  }: {
    documentId: string;
    correlationId: string;
  }) {
    this.logger.log(
      {
        message: 'Start method to get document by id',
        metadata: {
          correlationId,
          documentId,
        },
      },
      this.contextService,
    );
    try {
      await this.payloadService.validatePayload({
        objectValidator: PayloadDocumentByIdValidator,
        correlationId,
        data: { documentId },
      });

      // const documentsToResponseMounted =
      //   this.adapterService.mountResponseDocuments({
      //     productsAndTotalProducts,
      //     stamps,
      //     correlationId,
      //     orderBy: filter?.orderBy,
      //     filters,
      //   });

      this.logger.log(
        {
          message: 'Finish method to get document',
          metadata: {
            correlationId,
            documentId,
          },
        },
        this.contextService,
      );

      return documentId;
    } catch (e) {
      this.logger.warn(
        {
          message: 'Finish method prematurely to get document',
          metadata: {
            correlationId,
            documentId,
            errorMessage: e.message,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }

  public async getAllDocuments({ correlationId }: { correlationId: string }) {
    this.logger.log(
      {
        message: 'Start method to get all documents',
        metadata: {
          correlationId,
        },
      },
      this.contextService,
    );
    try {
      // const documentsToResponseMounted =
      //   this.adapterService.mountResponseDocuments({
      //     productsAndTotalProducts,
      //     stamps,
      //     correlationId,
      //     orderBy: filter?.orderBy,
      //     filters,
      //   });

      this.logger.log(
        {
          message: 'Finish method to get document',
          metadata: {
            correlationId,
          },
        },
        this.contextService,
      );

      return 1;
    } catch (e) {
      this.logger.warn(
        {
          message: 'Finish method prematurely to get document',
          metadata: {
            correlationId,
            errorMessage: e.message,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }

  public async uploadFile({
    correlationId,
    file,
  }: {
    correlationId: string;
    file: multer.Multer.File;
  }) {
    this.logger.log(
      {
        message: 'Start method to upload document by id',
        metadata: {
          correlationId,
        },
      },
      this.contextService,
    );
    try {
      if (!file) {
        throw new BadRequestException('Arquivo não enviado');
      }
      // const documentsToResponseMounted =
      //   this.adapterService.mountResponseDocuments({
      //     productsAndTotalProducts,
      //     stamps,
      //     correlationId,
      //     orderBy: filter?.orderBy,
      //     filters,
      //   });

      const fileSaved = await this.documentRepositroy.saveFile(file);

      this.logger.log(
        {
          message: 'Finish method to upload document',
          metadata: {
            correlationId,
          },
        },
        this.contextService,
      );

      return fileSaved;
    } catch (e) {
      this.logger.warn(
        {
          message: 'Finish method prematurely to upload document',
          metadata: {
            correlationId,
            errorMessage: e.message,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }

  public async updateDocument({
    correlationId,
    dataUpdateDocuments,
  }: {
    dataUpdateDocuments: IDataUpdateDocumentDto;
    correlationId: string;
  }) {
    const { documentId } = dataUpdateDocuments;

    this.logger.log(
      {
        message: 'Start method to update document by id',
        metadata: {
          correlationId,
          documentId,
        },
      },
      this.contextService,
    );
    try {
      await this.payloadService.validatePayload({
        objectValidator: PayloadDocumentByIdValidator,
        correlationId,
        data: dataUpdateDocuments,
      });

      // const documentsToResponseMounted =
      //   this.adapterService.mountResponseDocuments({
      //     productsAndTotalProducts,
      //     stamps,
      //     correlationId,
      //     orderBy: filter?.orderBy,
      //     filters,
      //   });

      this.logger.log(
        {
          message: 'Finish method to update document',
          metadata: {
            correlationId,
            documentId,
          },
        },
        this.contextService,
      );

      return documentId;
    } catch (e) {
      this.logger.warn(
        {
          message: 'Finish method prematurely to update document',
          metadata: {
            correlationId,
            documentId,
            errorMessage: e.message,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }

  public async deleteDocument({
    correlationId,
    dataDeleteDocuments,
  }: {
    dataDeleteDocuments: IDataDeleteDocumentDto;
    correlationId: string;
  }) {
    const { documentId } = dataDeleteDocuments;

    this.logger.log(
      {
        message: 'Start method to update document by id',
        metadata: {
          correlationId,
          documentId,
        },
      },
      this.contextService,
    );
    try {
      await this.payloadService.validatePayload({
        objectValidator: PayloadDocumentByIdValidator,
        correlationId,
        data: dataDeleteDocuments,
      });

      // const documentsToResponseMounted =
      //   this.adapterService.mountResponseDocuments({
      //     productsAndTotalProducts,
      //     stamps,
      //     correlationId,
      //     orderBy: filter?.orderBy,
      //     filters,
      //   });

      this.logger.log(
        {
          message: 'Finish method to update document',
          metadata: {
            correlationId,
            documentId,
          },
        },
        this.contextService,
      );

      return documentId;
    } catch (e) {
      this.logger.warn(
        {
          message: 'Finish method prematurely to update document',
          metadata: {
            correlationId,
            documentId,
            errorMessage: e.message,
            errorName: e.name,
            stackTrace: e.stack,
          },
        },
        this.contextService,
      );

      throw e;
    }
  }
}
