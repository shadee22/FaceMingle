
import { useEffect, useState } from 'react';
import { Sprinkls, Loading } from './Icon';
import axios from 'axios';

interface GenerateProps {
  face: File[] | null;
  bg: File[] | null;
  onChange: (newValue: any) => void;
  style: string;
}

enum LoadingStatus {
  Idle = 'Working on it',
  Generating = 'Wait for magic',
  Swapping = 'It takes like 45 seconds.',
  OnClose = 'Working with pixels',
}



export default function Generate(props: GenerateProps) {
  const { face, bg, onChange, style } = props;
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LoadingStatus.Idle);

  const handleImageSwap = async () => {

    if (!face || !bg) {
      alert('Please select both face and real images.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('face_to_swap', face[0]);
    formData.append('real_image', bg[0]);

    const app_engine_url = "https://freshpixl-home.el.r.appspot.com/api/swap-image"
    const url = "https://us-central1-freshpixl-home.cloudfunctions.net/swap "
    const localUrlMobile = "http://192.168.1.12:80/api/swap-image";
    const localUrl = "http://127.0.0.1:8000/api/swap-image";

    try {
      const response = await axios.post(app_engine_url, formData);
      //   setImageSrc(`data:image/png;base64,${response.data.result_image}`);
      onChange(`data:image/png;base64,${response.data.result_image}`)
    } catch (error) {
      alert('An error occurred while swapping images. Please try again.');
      console.error('Model Error: ', error);
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let counter = 0;
      setLoadingText(LoadingStatus.Generating);

      interval = setInterval(() => {
        counter += 1;
        switch (counter % 3) {
          case 1:
            setLoadingText(LoadingStatus.Swapping);
            break;
          case 2:
            setLoadingText(LoadingStatus.OnClose);
            break;
          default:
            setLoadingText(LoadingStatus.Generating);
            break;
        }
      }, 2000);
    } else {
      setLoadingText(LoadingStatus.Idle);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);
  const buttonClassNames = `text-center z-10 shadow-xl drop-shadow-lg ${(!face || !bg) ? "bg-gray-500 hover:shadow-2xl hover:border cursor-not-allowed" :
    "bg-blue-600 hover:bg-blue-700 cursor-pointer "} transition-all px-8 py-2.5 rounded-lg gap-2 text-white flex items-center font-normal`;

  const containerClassNames = style === "for_home" ? `absolute  w-full top-24 justify-center flex  text-center` :
    `absolute bottom-12 text-xl left-1/2 transform -translate-x-1/2 translate-y-1/2`;

  return (
    <div className={containerClassNames}>
      <button
        className={buttonClassNames}
        onClick={handleImageSwap}
        disabled={loading} >
        <p>{loading ? loadingText : 'Generate'}</p>
        <div>
          {!loading ? <Sprinkls /> : <Loading />}
        </div>
      </button>
    </div>

  )
}