import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAd, uploadPhotos } from "../redux/slices/ads";

export const useAdForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const processPhotos = async () => {
    if (selectedFiles.length === 0) return [];

    const uploadResult = await dispatch(uploadPhotos(selectedFiles));
    if (uploadResult.payload) {
      const fullUrls = uploadResult.payload.photos || [];
      return fullUrls.map((url) => url.replace("/uploads/ads/", ""));
    }
    return [];
  };

  const submitAd = async (values) => {
    setIsSubmitting(true);

    try {
      const imageUrls = await processPhotos();

      const adData = {
        ...values,
        price: parseFloat(values.price),
        photos: imageUrls,
      };

      const result = await dispatch(createAd(adData));

      if (result.payload) {
        navigate(`/ads/${result.payload._id}`);
      } else {
        alert("Nie udało się utworzyć ogłoszenia!");
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Wystąpił błąd podczas tworzenia ogłoszenia!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedFiles,
    isSubmitting,
    handleFileChange,
    submitAd,
  };
};
