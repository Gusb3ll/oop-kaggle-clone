import { useMutation, useQuery } from '@tanstack/react-query'
import cornerstone, { enable } from 'cornerstone-core'
// @ts-expect-error
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getFileMetadata, getPath } from '@/services'
import { ENDPOINT } from '@/utils/fetchers'

const Data = () => {
  const [imageData, setImageData] = useState<{
    id: string
    dicom: dicomParser.DataSet
  } | null>(null)
  // const [currentPath, setCurrentPath] = useState<string>('/')

  const { data: tree } = useQuery({
    queryKey: ['getPath'],
    queryFn: () => getPath(),
  })
  const getFileMetadataMutation = useMutation({
    mutationKey: ['getFileMetadata'],
    mutationFn: (filePath: string) => getFileMetadata(filePath),
  })

  const onRender = async () => {
    try {
      const res = await getFileMetadataMutation.mutateAsync('1.dcm')

      if (res.type === 'dcm') {
        const buffer = Buffer.from(res.base64, 'base64')
        const dataSet = dicomParser.parseDicom(buffer)

        setImageData({
          id: `wadouri://${ENDPOINT.replaceAll('http://', '')}/file/1.dcm`,
          dicom: dataSet,
        })
      }
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser

    const element = document.getElementById('dicom-image') as HTMLElement
    enable(element)
  }, [])

  useEffect(() => {
    const element = document.getElementById('dicom-image') as HTMLElement

    if (imageData) {
      cornerstone
        .loadImage(imageData.id)
        .then(image => {
          console.log(image)
          cornerstone.displayImage(element, image)
        })
        .catch(error => {
          console.error('Error : ', error)
        })
    }
  }, [imageData])

  return (
    <>
      <div className="flex flex-row justify-between gap-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold">Dataset Description</h1>
          <p>
            The goal of this competition is to identify medical conditions
            affecting the lumbar spine in MRI scans. This competition uses a
            hidden test. When your submitted notebook is scored, the actual test
            data (including a full length sample submission) will be made
            available to your notebook.
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold">Files</h1>
            <h2>train.csv Labels for the train set.</h2>
            <p>
              - study_id - The study ID. Each study may include multiple series
              of images.
              <br />- [condition]_[level] - The target labels, such as
              spinal_canal_stenosis_l1_l2, with the severity levels of
              Normal/Mild, Moderate, or Severe. Some entries have incomplete
              labels.
            </p>

            <h2>train_label_coordinates.csv</h2>
            <p>
              - study_id
              <br />- series_id - The imagery series ID.
              <br />- instance_number - The image&apos;s order number within the
              3D stack.
              <br />- condition - There are three core conditions: spinal canal
              stenosis, neural_foraminal_narrowing, and subarticular_stenosis.
              The latter two are considered for each side of the spine.
              <br />- level - The relevant vertebrae, such as l3_l4
              <br />- [x/y] - The x/y coordinates for the center of the area
              that defined the label.
            </p>

            <h2>sample_submission.csv</h2>
            <p>
              - row_id - A slug of the study ID, condition, and level such as
              12345_spinal_canal_stenosis_l3_l4.
              <br />- [normal_mild/moderate/severe] - The three prediction
              columns.
            </p>

            <h2>
              [train/test]_images/[study_id]/[series_id]/[instance_number].dcm
              The imagery data.
            </h2>

            <h2>[train/test]_series_descriptions.csv</h2>
            <p>
              - study_id
              <br />- series_id
              <br />- series_description The scan&apos;s orientation.
            </p>
            <hr />
          </div>
        </div>
        <div className="mt-8 flex w-[50%] flex-col gap-4">
          <div className="flex flex-col">
            <h1>Files</h1>
            <p>147320 files</p>
          </div>
          <div className="flex flex-col">
            <h1>Size</h1>
            <p>35.34 GB</p>
          </div>
          <div className="flex flex-col">
            <h1>Type</h1>
            <p>dcm, csv</p>
          </div>
          <div className="flex flex-col">
            <h1>License</h1>
            <p className="text-xs">Subject to Competition Rules</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-8">
        <div className="flex flex-col gap-8">
          <div id="dicom-image" className="h-[600px] w-full" />
          {JSON.stringify(tree)}
        </div>
        <button onClick={() => onRender()}>RENDER 1.dcm</button>
        <div className="mt-8 flex w-[50%] flex-col gap-4">
          <div className="flex flex-col">
            <h1>Data Explorer</h1>
            <p>35.34 GB</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Data
