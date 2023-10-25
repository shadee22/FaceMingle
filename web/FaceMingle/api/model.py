import cv2
import os
import numpy as np
from fastapi import File
from insightface.app import FaceAnalysis
import insightface
import matplotlib.pyplot as plt

class FaceSwapper:              
    def __init__(self, model_path=None):
        """
        Initialize the FaceSwapper with the path to the model.

        Args:
            model_path (str): The path to the FaceSwapper model. (default: None)
        """
        if model_path is None:
            raise ValueError("You must provide the 'model_path' argument when creating an instance of FaceSwapper.")

        self.swapper = insightface.model_zoo.get_model(model_path)
        self.app  = FaceAnalysis(name='buffalo_l')
        self.app.prepare(ctx_id=0 , det_size=(640,640))
        
    def _validate_image(self, img_url):
        """
        Private method to validate the image file.

        Args:
            img_url (str): The path to the image file.

        Raises:
            FileNotFoundError: If the image file does not exist.

        Returns:
            bool: True if the image is valid, False otherwise.
        """

        if not os.path.exists(img_url) :
                raise FileNotFoundError(f"The image file '{img_url}' does not exist.")
        try:
            img = cv2.imread(img_url)
            return img is not None
        except Exception:
            return False

    def plot_image(self, img_url):
        """
        Display the given image.

        Args:
            img_url (str): The path to the image file.
        """
        if self._validate_image(img_url):
            plt.imshow(cv2.imread(img_url)[:, :, ::-1]) #  using ::-1 for change it to RGB
            plt.show()
        else:
            print(f"Invalid image: {img_url}")

    def swap_image(self, face_to_swap_url, real_image_url , plot=False , download_image=False):
        """
        Swap the face from the 'face_to_swap_url' image into the 'real_image_url' image.

        Args:
            face_to_swap_url (str): The path to the image containing the face to be swapped.
            real_image_url (str): The path to the image in which the face will be swapped.
            plot (bool, optional): If True, the resulting image will be plotted using matplotlib. 
                                  Defaults to False.

        Returns:
            numpy.ndarray or None: If 'plot' is False, it returns the image with the swapped face 
                                  as a numpy array. If 'plot' is True, the image will be displayed 
                                  using matplotlib, and the function will return None.
        """
        if not self._validate_image(face_to_swap_url):
            print(f"Invalid image face_to_swap_url: {face_to_swap_url}")
            return None

        if not self._validate_image(real_image_url):
            print(f"Invalid real_image_url: {real_image_url}")
            return None

        face_to_swap = cv2.imread(face_to_swap_url)
        real_image = cv2.imread(real_image_url)

        myface = self.app.get(face_to_swap)[0]

        faces = self.app.get(real_image)
        res = real_image.copy()

        for face in faces:
            res = self.swapper.get(res, face, myface, paste_back=True)
        if plot:
          plt.imshow(res[:,:,::-1])
          plt.show()
          if download_image :
            self.download_image(res)
          return res
        return res
    

    def swap_image_from_request(self, face_to_swap, real_image):
        print("Started to perform function")
        import base64
        try:
            print("Getting faces")
            myface = self.app.get(face_to_swap)
            if not myface:
                print("No face found in face_to_swap image.")
                return None

            faces = self.app.get(real_image)
            if not faces:
                print("No faces found in real_image.")
                return None

            myface = myface[0]
            res = real_image.copy()
            print("Swapping Every Faces")
            for face in faces:
                res = self.swapper.get(res, face, myface, paste_back=True)

            print("Started Encoding")
            retval, buffer = cv2.imencode('.png', res)
            base64_image = base64.b64encode(buffer).decode('utf-8')
            print("returend base 64")
            return base64_image

        except Exception as e:
            print(f"Error decoding image data: {e}")
            return None

    def download_image(self,  res : np.ndarray):
        """
        Swap the face from the 'face_to_swap_url' image into the 'real_image_url' image
        and download the resulting image.

        Args:
            face_to_swap_url (str): The path to the image containing the face to be swapped.
            real_image_url (str): The path to the image in which the face will be swapped.
            output_path (str): The path where the resulting image will be saved.

        Returns:
            bool: True if the image is successfully saved, False otherwise.
        """
        output_path= "downloaded_image/image.png"
        if res is not None:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            # Check if the file already exists
            counter = 1
            base_output_path, file_extension = os.path.splitext(output_path)
            while os.path.exists(output_path):
                output_path = f"{base_output_path}_{counter}{file_extension}"
                counter += 1
            cv2.imwrite(output_path, res)
            print(f"Downloaded image {output_path}")
            return True
        else:
            return False


            # face = "/content/Screenshot_2023-07-23-18-23-50-11_92460851df6f172a4592fca41cc2d2e6.jpg"
# real = "/content/99211908.png"
# res = instance.swap_image(face, real ,True)