import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import fs from 'fs'
import path from 'path'

@Injectable()
export class AppService {
  async getPaths(dir?: string) {
    try {
      const dataDir = path.join(process.cwd(), `./data${dir ? `/${dir}` : ''}`)

      const tree: { name: string; type: string }[] = []
      const files = fs.readdirSync(dataDir)

      files.map(file => {
        const filePath = path.join(dataDir, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          tree.push({
            name: file,
            type: 'directory',
          })
        } else {
          tree.push({
            name: file,
            type: 'file',
          })
        }
      })

      return tree
    } catch {
      throw new BadRequestException('Invalid path')
    }
  }

  async getFile(filePath: string) {
    try {
      const targetFilePath = path.join(process.cwd(), `./data/${filePath}`)
      const fileBuf = fs.readFileSync(targetFilePath)

      return fileBuf
    } catch {
      throw new NotFoundException('File not found')
    }
  }

  async getFileMetadata(filePath: string) {
    try {
      const targetFilePath = path.join(process.cwd(), `./data/${filePath}`)
      const fileBuf = fs.readFileSync(targetFilePath)

      if (targetFilePath.endsWith('.dcm')) {
        return { type: 'dcm', base64: fileBuf.toString('base64') }
      }
    } catch {
      throw new NotFoundException('File not found')
    }
  }
}
