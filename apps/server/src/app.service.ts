import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import fs from 'fs'
import path from 'path'

import { Path } from './app.dto'

@Injectable()
export class AppService {
  async getPaths(dir?: string) {
    try {
      const dataDir = path.join(process.cwd(), `./data${dir ? `/${dir}` : ''}`)

      const tree: Path = {
        name: 'root',
        checked: 0,
        isOpen: true,
        children: [],
      }
      const files = fs.readdirSync(dataDir)

      files.map(async file => {
        const filePath = path.join(dataDir, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          tree.children!.push({
            name: file,
            checked: 0,
            isOpen: false,
            children: (await this.getPaths(dir ? `${dir}/${file}` : file))
              .children,
          })
        } else {
          tree.children!.push({
            name: file,
            checked: 0,
            isOpen: false,
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
      } else if (targetFilePath.endsWith('.csv')) {
        return { type: 'csv', base64: fileBuf.toString('base64') }
      }
    } catch {
      throw new NotFoundException('File not found')
    }
  }
}
