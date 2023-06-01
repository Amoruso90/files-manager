import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { existsSync, mkdirSync } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
    const folderPath = 'files';
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }
  }

  @Post('import/:sellerid')
  @UseInterceptors(FileInterceptor('file'))
  async importarArchivo(
    @UploadedFile() file,
    @Param('sellerid') sellerId: string,
  ) {
    return await this.filesService.importFiles(file, sellerId);
  }
}
