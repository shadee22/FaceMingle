/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Header from '@/components/Header';
import Generate from '@/components/Generate';
import Dropzone from "@/components/Dropzone";
import Footer from "@/components/Footer";

export function useImageState() {
  const [files, setFiles] = useState<{ face: File[] | null, bg: File[] | null }>({ face: null, bg: null });
  const [generatedImage, setGeneratedImage] = useState<any | null>(null);
  const [generatedImagesArray, setGeneratedImagesArray] = useState<Array<{ original_images: File[], generated_image: any }>>([]);
  const [shouldRemoveFiles, setShouldRemoveFiles] = useState(false);

  const removeFiles = () => {
    setShouldRemoveFiles(true);
    setFiles({ face: null, bg: null });  // Add this line
    setGeneratedImage(null)

  };
  const handleSetFiles = (type: string, newValue: File[] | null) => {
    setFiles(prev => ({ ...prev, [type]: newValue }));
  };

  const handleGenerateImg = (newValue: any) => {
    setGeneratedImage(newValue);
    setGeneratedImagesArray((prevImages) => [...prevImages, {
      original_images: [...files.face ?? [], ...files.bg ?? []],
      generated_image: newValue
    }]);
  };

  const clearImages = () => {
    console.log("Clear Image")
  };

  return { files, generatedImage, handleSetFiles, handleGenerateImg, clearImages, generatedImagesArray, shouldRemoveFiles, setShouldRemoveFiles, removeFiles };
}


// Custom hook for handling hover state
function useHover() {
  const [isHovering, setIsHovering] = useState(false);

  const onMouseEnter = () => {
    setIsHovering(true);
  };

  const onMouseLeave = () => setIsHovering(false);

  return { isHovering, onMouseEnter, onMouseLeave };
}
export default function Home() {

  const { isHovering, onMouseEnter, onMouseLeave } = useHover();

  useEffect(() => {
    // Fetch Python API...
  }, []);

  const {
    files,
    generatedImage,
    handleSetFiles,
    handleGenerateImg,
    clearImages,
    removeFiles,
    shouldRemoveFiles
  } = useImageState();

  const uploadTypes = ['face', 'bg'];


  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <main className="mx-auto flex max-w-screen-lg flex-wrap px-4 items-center justify-between flex-col pt-12">
        <div className="grid w-full h-full grid-cols-2 gap-16">
          <div className="w-full">
            <h1 className="mb-8 text-5xl font-extrabold">Experience Face Swapping Like Never Before!</h1>
            <p className="font-medium text-lg">The fun and games of face swapping were just the beginning. Take the leap into the world of groundbreaking technological advancements.</p>
          </div>
          {generatedImage == null ? (
            <div className="h-32 relative w-full space-y-2 rounded-xl bg-white">
              {uploadTypes.map((type) => (
                <Dropzone key={type} type={type} onChange={(files) => handleSetFiles(type, files)} remove={removeFiles}
                  shouldRemoveFiles={shouldRemoveFiles} />
              ))}
              <Generate face={files.face} bg={files.bg} onChange={handleGenerateImg} style="for_home" />
            </div>
          ) : (
            <div className="flex-col h-96">
              <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className="relative max-h-80 h-80 flex items-center justify-center w-full overflow-hidden rounded-xl bg-white p-2 shadow-lg"
              >
                {/* Additional UI elements can be added here */}
                <div className={`absolute top-0 left-0 w-full h-full z-99 p-4 bg-white/70 ${isHovering ? 'opacity-100' : 'opacity-0'}
                 transition-opacity duration-300`}>
                  <a href={generatedImage} download="generated_image.png">
                    <button className="w-full rounded-lg font-bold cursor-pointer text-center bg-black text-white px-4 py-2">
                      Download</button>
                  </a>
                </div>
                <img src={generatedImage} className="h-full object-cover rounded-lg" alt="Swapped Image" />
              </div>
              <button onClick={removeFiles} className="h-10 hover:border transition-all my-2 rounded-lg w-full
              bg-white text-center font-bold flex items-center justify-center shadow-lg">Clear Generation</button>
            </div>
          )}
        </div>
        <div className="p-12">
          <div className="grid space-y-12 place-items-center items-center">
            <img className="" src="/mark.png" alt="" />
            <img className="" src="/will.png" alt="" />
          </div>
        </div>
        <div className="flex flex-auto gap-4 pt-5">
          <div className="h-20 flex w-full">
            {Array(3).fill(3).map((_, index) => (
              <div key={index}>
                <h4 className="font-medium pb-2">Face Swap like a Pro</h4>
                <p>The largest resolution for face swap on the market: 1024px</p>
              </div>
            ))}
          </div>
        </div>
        {/*<div className="p-8">*/}
        {/*  <h1 className="text-3xl font-bold text-center">Examples</h1>*/}
        {/*</div>*/}
      </main>
      <Footer/>
    </main>
  );
}
