import 'react-folder-tree/dist/style.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import cornerstone, { enable } from 'cornerstone-core'
// @ts-expect-error
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import { useEffect, useState } from 'react'
import FolderTree, { NodeData } from 'react-folder-tree'
import { toast } from 'sonner'

import DataInfo from './Info'

import { Path, getFileMetadata, getPath } from '@/services'
import { ENDPOINT } from '@/utils/fetchers'

type PathWithUrl = Path & { url: string }

const Data = () => {
  const [imageData, setImageData] = useState<{
    url: string
    dataSet: dicomParser.DataSet
  } | null>(null)
  const [isCsv, setIsCsv] = useState(false)

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
  const { data: tree } = useQuery({
    queryKey: ['getPath'],
    queryFn: () => getPath(),
  })
  const getFileMetadataMutation = useMutation({
    mutationKey: ['getFileMetadata'],
    mutationFn: (filePath: string) => getFileMetadata(filePath),
  })

  const onNameClick = async ({ nodeData }: { nodeData: NodeData }) => {
    const { url } = nodeData

    if (['.dcm', '.csv'].every(ext => !url.endsWith(ext))) {
      return
    }

    const renderUrl = url.replaceAll('/root/', '')
    await onRender(renderUrl)
  }

  const onRender = async (renderUrl: string) => {
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

        setImageData({
          url: `wadouri://${ENDPOINT.replaceAll('http://', '')}/file${renderUrl}`,
          dataSet: dataSet,
        })
      }
      if (res.type === 'csv') {
        setIsCsv(true)
        setImageData(null)
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
        .catch(error => {
          console.error('Error : ', error)
        })
    }
  }, [imageData])

  return (
    <>
      <DataInfo />
      <div className="mt-8 grid w-full grid-cols-6 gap-8">
        {isCsv ? (
          <div className="col-span-4 h-[600px] w-full rounded-xl border border-gray-300 p-4">
            kuy
          </div>
        ) : (
          <div className="col-span-4 h-[600px] w-full rounded-xl border border-gray-300 p-4">
            <div id="dicom-image" className="h-full" />
          </div>
        )}
        <div className="col-span-2 flex max-h-[400px] w-full flex-col overflow-y-auto">
          <div className="flex flex-col">
            <h1 className="font-bold">Data Explorer</h1>
            <p>35.34 GB</p>
          </div>
          {tree ? (
            <FolderTree
              data={addUrl(tree as PathWithUrl)}
              showCheckbox={false}
              readOnly={true}
              onNameClick={onNameClick}
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
