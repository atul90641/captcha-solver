import React, { useState } from 'react';
import axios from 'axios';
import './CaptchaDetector.css'; // Import the CSS file

const CaptchaDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [captchaText, setCaptchaText] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Set the image preview
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile)
    {
      alert("please select a file");
      return;
    } 

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('https://3c41-47-15-215-176.ngrok-free.app/detect-captcha', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaptchaText(response.data.captcha_text);
      setIsCopied(false); // Reset copy status
    } catch (error) {
      console.error('Error detecting CAPTCHA:', error);
    }
  };

  const copyToClipboard = () => {
    if (captchaText) {
      navigator.clipboard.writeText(captchaText)
        .then(() => setIsCopied(true)) // Update copy status
        .catch(err => console.error('Failed to copy text:', err));
    }
  };

  return (
    <div className="captcha-detector">
      <h2>Upload CAPTCHA Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Detect CAPTCHA</button>
      </form>
      {imagePreview && (
        <div className="image-preview">
          <h3>Uploaded Image:</h3>
          <img src={imagePreview} alt="Uploaded CAPTCHA" />
        </div>
      )}
      {captchaText && (
        <div>
          <h3>Detected CAPTCHA Text:</h3>
          <p>{captchaText}</p>
          <button className="copy-button" onClick={copyToClipboard}>
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CaptchaDetector;
