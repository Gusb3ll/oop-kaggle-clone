import 'react-folder-tree/dist/style.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import cornerstone, { enable } from 'cornerstone-core'
// @ts-expect-error
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import PapaParse from 'papaparse'
import { useEffect, useState } from 'react'
import FolderTree, { NodeData } from 'react-folder-tree'
import { toast } from 'sonner'

import CSVTable from './CSVTable'
import DataInfo from './Info'

import { Path, getFileMetadata, getPath } from '@/services'
import { ENDPOINT } from '@/utils/fetchers'

export type PathWithUrl = Path & { url: string }
type ImageData = {
  url: string
  dataSet: dicomParser.DataSet
}

const Data: React.FC = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [isCsv, setIsCsv] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])

  const { data: tree } = useQuery({
    queryKey: ['getPath'],
    queryFn: () => getPath(),
  })

  const getFileMetadataMutation = useMutation({
    mutationKey: ['getFileMetadata'],
    mutationFn: (filePath: string) => getFileMetadata(filePath),
  })

  // dynamically assign url to each node within the tree
  const addUrl = (node: PathWithUrl, parentUrl = '') => {
    const currentUrl = `${parentUrl}/${node.name}`

    node.url = currentUrl

    if (node.children) {
      node.children = node.children.map(child =>
        addUrl(child as PathWithUrl, currentUrl),
      )
    }

    return node
  }

  const handleFileClick = async ({ nodeData }: { nodeData: NodeData }) => {
    const { url } = nodeData
    if (['.dcm', '.csv'].every(ext => !url.endsWith(ext))) {
      return
    }

    const renderUrl = url.replaceAll('/root/', '')
    await handleFileRender(renderUrl)
  }

  const handleFileRender = async (renderUrl: string) => {
    try {
      if (!renderUrl) {
        return toast.error('No file selected')
      }

      const res = await getFileMetadataMutation.mutateAsync(renderUrl)

      if (res.type === 'dcm') {
        setIsCsv(false)
        setImageData(null)
        const buffer = Buffer.from(res.base64, 'base64')
        const dataSet = dicomParser.parseDicom(buffer)

        const url = `wadouri://${ENDPOINT.replaceAll('http://', '')}/file${renderUrl}`

        setImageData({ url, dataSet })
      } else if (res.type === 'csv') {
        setIsCsv(true)
        setImageData(null)
        const buffer = Buffer.from(res.base64, 'base64')
        const csv = PapaParse.parse(buffer.toString(), { header: true })

        setCsvData(csv.data)
      }
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser
  }, [])

  useEffect(() => {
    const element = document.getElementById('dicom-image') as HTMLElement

    if (imageData) {
      enable(document.getElementById('dicom-image') as HTMLElement)
      cornerstone
        .loadImage(imageData.url)
        .then(image => {
          cornerstone.displayImage(element, image)
        })
        .catch(e => toast.error((e as Error).message))
    }
  }, [imageData])

  return (
    <>
      <DataInfo />

      <div className="mt-8 grid w-full grid-cols-6 gap-8">
        {isCsv ? (
          <div className="col-span-4 h-[600px] w-full overflow-x-auto rounded-xl border border-gray-300 p-4">
            <CSVTable csv={csvData} />
          </div>
        ) : (
          <div className="col-span-4 h-[600px] w-full rounded-xl border border-gray-300 p-4">
            <div id="dicom-image" className="h-full" />
          </div>
        )}
        <div className="col-span-2 flex max-h-[400px] w-full flex-col overflow-y-auto border-b border-gray-300">
          <div className="flex flex-col">
            <h1 className="font-bold">Data Explorer</h1>
            <p>35.34 GB</p>
          </div>
          {tree ? (
            <FolderTree
              data={addUrl(tree as PathWithUrl)}
              showCheckbox={false}
              readOnly={true}
              onNameClick={handleFileClick}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mt-4">
        <input
          readOnly
          className="input input-bordered w-full font-bold"
          defaultValue="kaggle competitions download -c rsna-2024-lumbar-spine-degenerative-classification"
        />
      </div>
      <hr className="mt-4" />
    </>
  )
}

export default Data
