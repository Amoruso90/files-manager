import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import Redis from 'ioredis';

@Injectable()
export class FilesService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async importFiles(file, sellerId: string) {
    try {
      const allowedExtensions = ['xls', 'xlsx'];
      const fileExtension = file.originalname.split('.').pop();

      //extensiones permitidas
      if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException('Extensions supported .xls and .xlsx');
      }

      //interrumpir si ya esta procesando un archivo de este seller
      const seller = JSON.parse(await this.redis.get(sellerId));

      if (seller)
        throw new BadRequestException(
          `Seller ${sellerId} is already processing a file`,
        );

      const response = {
        success: [],
        errors: [],
      };

      const fileName = `${sellerId}-${this.currrentDateTime()}.${fileExtension}`;
      const path = `files/${fileName}`; // Ruta donde se guardará el archivo en el repositorio "files"

      const fileStream = createWriteStream(path);
      fileStream.write(file.buffer);
      fileStream.end();

      //guardar registro en redis - filename como key - register = 0, nombre de archivo
      this.redis.set(sellerId, JSON.stringify({ register: 0, fileName }));

      //leer excel
      //verificaciones a los registros

      //traer todos los registros del seller de la BD y compararlos con los que se encuentran en el archivo

      //procesar los que tengan cambios con respecto a la BD
      //cada vez que se procesa un registro guardar en redis la ultima posicion por si se corta la conexion

      for (let i = 1; i < 10; i++) {
        this.redis.set(sellerId, JSON.stringify({ register: i, fileName }));
      }

      //al terminar de procesar borrar la key de redis
      this.redis.del(sellerId);
      //borrar el archivo

      return response;
    } catch (error) {
      throw error;
    }
  }

  private padZero(numero) {
    return numero.toString().padStart(2, '0');
  }

  private currrentDateTime() {
    const date = new Date();

    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hs = this.padZero(date.getHours());
    const min = this.padZero(date.getMinutes());
    const sec = this.padZero(date.getSeconds());

    return `${year}-${month}-${day}-${hs}-${min}-${sec}`;
  }
}
