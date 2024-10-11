import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import {
  MdCode,
  MdExpandMore,
  MdOutlineComment,
  MdOutlineEmojiEvents,
  MdOutlineExplore,
  MdOutlineSchool,
  MdOutlineTableChart,
} from 'react-icons/md'

const Data = dynamic(() => import('@/components/Data'), {
  ssr: false,
})

const Home = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <div className="flex h-full w-screen flex-row">
      <div className="flex flex-col items-center gap-2 border-r border-r-gray-200 px-2 py-4">
        <div className="mt-12 flex w-full rounded-full p-1 shadow-gray-300">
          <Image
            src="/plus.svg"
            alt="Add"
            className="h-10 w-10"
            height={36}
            width={36}
          />
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <MdOutlineExplore className="h-6 w-6 text-[#5f6368]" />
          <MdOutlineEmojiEvents className="h-6 w-6 text-[#5f6368]" />
          <MdOutlineTableChart className="h-6 w-6 text-[#5f6368]" />
          <MdCode className="h-6 w-6 text-[#5f6368]" />
          <MdOutlineComment className="h-6 w-6 text-[#5f6368]" />
          <MdOutlineSchool className="h-6 w-6 text-[#5f6368]" />
          <MdExpandMore className="h-6 w-6 text-[#5f6368]" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row justify-between gap-8 px-12 py-3">
          <input
            type="text"
            className="input w-full rounded-full border-gray-300"
          />
          <div className="flex flex-row items-center gap-4">
            <button className="btn btn-ghost rounded-full">Sign In</button>
            <button className="btn btn-primary btn-sm rounded-full">
              <p className="font-bold text-white">Register</p>
            </button>
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between px-12">
          <div className="flex flex-row items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-7 w-7 rounded-full border-2 border-black"
              src="https://storage.googleapis.com/kaggle-organizations/4269/thumbnail.png"
              alt="Kaggle"
            />
            <p className="text-xs font-bold uppercase text-gray-500">
              Radiological Society of North America · Featured Code Competition
              · 2 days ago
            </p>
          </div>
          <button className="btn btn-primary btn-sm rounded-full">
            <p className="font-bold text-white">Late Submission</p>
          </button>
        </div>
        <div className="mt-4 flex flex-row items-center justify-between gap-8 px-12">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">
              RSNA 2024 Lumbar Spine Degenerative Classification
            </h1>
            <h2>Classify lumbar spine degenerative conditions</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.kaggle.com/competitions/71549/images/header"
            className="h-[140px] w-[280px] rounded-xl"
            alt="ISIC 2024 - Skin Cancer Detection with 3D-TBP"
          />
        </div>
        <div role="tablist" className="tabs tabs-bordered w-[20%] px-12">
          <a
            role="tab"
            className={`tab text-[16px] text-[#5f6368] ${currentTab === 0 ? 'tab-active' : ''}`}
            onClick={() => setCurrentTab(0)}
          >
            Overview
          </a>
          <a
            role="tab"
            className={`tab text-[16px] text-[#5f6368] ${currentTab === 1 ? 'tab-active' : ''}`}
            onClick={() => setCurrentTab(1)}
          >
            Data
          </a>
        </div>
        <hr className="-mt-2" />
        <div className="px-12 py-4">
          <Data />
        </div>
      </div>
    </div>
  )
}

export default Home
