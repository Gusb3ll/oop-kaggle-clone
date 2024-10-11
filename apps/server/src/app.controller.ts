import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common'
import { AppService } from 'app.service'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('/')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('/path*')
  async getPaths(@Req() req: FastifyRequest) {
    const path = (req.params as { [key: string]: string })['*']

    const res = await this.service.getPaths(path)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Get('/file*')
  async getFile(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const path = (req.params as { [key: string]: string })['*']

    const fileBuf = await this.service.getFile(path)

    res.type('application/dicom').send(fileBuf)
  }

  @Get('/file-metadata*')
  async getFileMetadata(@Req() req: FastifyRequest) {
    const path = (req.params as { [key: string]: string })['*']

    const res = await this.service.getFileMetadata(path)

    return { statusCode: HttpStatus.OK, data: res }
  }
}
