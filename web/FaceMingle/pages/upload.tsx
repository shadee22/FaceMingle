/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Generate from '@/components/Generate';
import { useImageState } from './index'
import Footer from '@/components/Footer';
import Dropzone from '@/components/Dropzone';

const UploadPage = () => {
  const {
    files,
    generatedImage,
    handleSetFiles,
    handleGenerateImg,
    generatedImagesArray,
    shouldRemoveFiles,
    removeFiles,
    setShouldRemoveFiles
  } = useImageState();

  useEffect(() => {
    if (shouldRemoveFiles) {
      setShouldRemoveFiles(false);
    }
  }, [shouldRemoveFiles]);

  const [activeTab, setActiveTab] = useState('magic'); // Initial active tab is 'original'

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container grid py-4 space-y-4 mx-auto max-w-screen-lg h-full">
        <div className='text-2xl py-4 font-bold text-center'>
          Upload your <span className='text-3xl text-blue-500'>Face</span>  and the  <span className='text-3xl text-blue-500'>image you want </span> to swap.
        </div>
        <div className="relative px-16 grid grid-cols-2 h-64 gap-4">
          <Dropzone type="face" onChange={(files) => handleSetFiles('face', files)} remove={removeFiles}
            shouldRemoveFiles={shouldRemoveFiles} />
          <Generate face={files.face} bg={files.bg} onChange={handleGenerateImg} style="for_upload" />
          <Dropzone type="bg" onChange={(files) => handleSetFiles('bg', files)} remove={removeFiles}
            shouldRemoveFiles={shouldRemoveFiles} />
        </div>
        {(files.face || files.bg) && (
          <div className='flex justify-center items-center'>
            <button type="button" onClick={removeFiles} className={`w-fit px-8 py-2.5 text-sm rounded-full border  font-bold }`}>Clear Images</button>
          </div>
        )}
        {generatedImagesArray.length == 0 && (
            <div className="text-center py-8 text-lg text-gray-500 font-semibold">Generated Images will Display here.</div>
        )}
        {generatedImagesArray.slice().reverse().map((imageObj, index) => (
          <div
            key={index}
            className="bg-white  p-4  rounded-lg border w-full drop-shadow-xl"
          >
            <div className='pb-2 text-blue-500 font-bold'>
              <ul className='flex gap-4'>
                <li
                  className={`cursor-pointer ${activeTab === 'original' ? 'border-b-4 border-blue-500' : ''
                    }`}
                  onClick={() => handleTabClick('original')}
                >
                  Original Images
                </li>
                <li
                  className={`cursor-pointer ${activeTab === 'magic' ? 'border-b-4 border-blue-500' : ''
                    }`}
                  onClick={() => handleTabClick('magic')}
                >
                  Magic Image
                </li>
              </ul>
            </div>
            <div className="h-96  grid grid-cols-3">
              {/* On origingals tab it (use gap-4)  */}
              <div className="col-span-2 justify-center mx-auto w-fit items-center flex h-full border rounded-xl overflow-hidden">
                {activeTab === 'original' ? (
                  <div className='flex gap-2 w-fit rounded-2xl'>
                    {imageObj.original_images.map((img, imgIndex) => (
                      <img key={imgIndex} src={URL.createObjectURL(img)}
                        className="h-full object-contain w-full overflow-hidden" alt="Original" />
                    ))}
                  </div>
                ) : (
                  <img src={imageObj.generated_image}
                    className="h-full object-contain w-full overflow-hidden" alt="Generated" />
                )}
              </div>

              <div className="flex h-full items-center justify-center">
                <div className="text-center ">
                  <a href={imageObj.generated_image} download="generated_image.png">
                    <button className="px-8 py-2.5 rounded-full bg-black text-white font-medium ">Download</button>
                  </a>
                  <p className="text-gray-500 text-xs py-2">You can Download here</p>
                </div>
              </div>
            </div>
          </div>
        ))}

      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;
