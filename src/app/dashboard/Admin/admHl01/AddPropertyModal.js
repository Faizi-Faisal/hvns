import React, { useState } from 'react';
import styles from './admin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationCircle, faSoap, faJugDetergent } from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { faWifi, faSnowflake, faCouch, faCoffee, faDumbbell, faShower, faTshirt, faBed, faTv, faTint, faBatteryHalf } from '@fortawesome/free-solid-svg-icons';


const AddPropertyModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    hostelName: '',
    address: '',
    location: '',
    contactNumber: '',
    totalBeds: '',
    googleMapUrl: '',
    description: '',
    price: '',
    singleSharingPrice: '',
    doubleSharingPrice: '',
    tripleSharingPrice: '',
    fourSharingPrice: '',
    sixSharingPrice: '',
    amenities: [
      { name: 'Wifi', selected: false },
      { name: 'Laundry', selected: false },
      { name: 'AC', selected: false },
      { name: 'Cafeteria', selected: false },
      { name: 'Gym', selected: false },
      { name: 'Attached Washroom', selected: false },
      { name: 'Spacious Cupboard', selected: false },
      { name: 'Single Bed', selected: false },
      { name: 'Double Bed', selected: false },
      { name: 'Hot Water', selected: false },
      { name: 'Television', selected: false },
      { name: 'Water Purifier', selected: false },
      { name: 'Washing Area', selected: false },
      { name: 'Washing Machine', selected: false },
      { name: 'Power Backup', selected: false },
    ],
    images: [],
    preferredBy: '',
    virtualVideoUrl: '',
  });

  const iconMap = {
    Wifi: faWifi,
    Laundry: faTshirt,
    AC: faSnowflake,
    Cafeteria: faCoffee,
    Gym: faDumbbell,
    'Attached Washroom': faShower,
    'Spacious Cupboard': faCouch,
    'Single Bed': faBed,
    'Double Bed': faBed,
    'Hot Water': faShower,
    Television: faTv,
    'Water Purifier': faTint,
    'Washing Area': faSoap,
    'Washing Machine': faJugDetergent,
    'Power Backup': faBatteryHalf,
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const [stepErrors, setStepErrors] = useState([false, false, false, false]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = {
      ...updatedAmenities[index],
      selected: !updatedAmenities[index].selected
    };
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(file => !selectedImages.some(img => img.name === file.name));
    setSelectedImages(prevImages => [...prevImages, ...uniqueFiles]);
  };

  const removeImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async (imageFiles) => {
    const uploadedImages = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        uploadedImages.push(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image.');
      }
    }
    return uploadedImages;
  };

  const validateForm = () => {
    const newErrors = [false, false, false, false];
    let valid = true;
  
    if (activeTab === 1) {
      const requiredFields = ['hostelName', 'address', 'location', 'contactNumber', 'totalBeds', 'googleMapUrl', 'preferredBy'];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          newErrors[0] = true;
          valid = false;
        }
      });
    } else if (activeTab === 2) {
      if (!formData.description || !formData.price) {
        newErrors[1] = true;
        valid = false;
      }
      const numericFields = ['price', 'singleSharingPrice', 'doubleSharingPrice', 'tripleSharingPrice', 'fourSharingPrice', 'sixSharingPrice'];
      numericFields.forEach(field => {
        if (formData[field] && isNaN(Number(formData[field]))) {
          newErrors[1] = true;
          valid = false;
        }
      });
    } else if (activeTab === 3) {
      if (!formData.amenities.some((amenity) => amenity.selected)) {
        newErrors[2] = true;
        valid = false;
      }
    } else if (activeTab === 4) {
      if (!formData.virtualVideoUrl) {
        newErrors[3] = true;
        valid = false;
      }
    }
  
    setStepErrors(newErrors);
    return valid;
  };
  

  const handleNext = () => {
    if (validateForm()) {
      const nextTab = activeTab < 4 ? activeTab + 1 : activeTab;
      setActiveTab(nextTab);
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedImages = await uploadImages(selectedImages);

      await axios.post('/api/uploadProperty', {
        hostelName: formData.hostelName,
        address: formData.address,
        location: formData.location,
        contactNumber: formData.contactNumber,
        totalBeds: formData.totalBeds,
        amenities: formData.amenities,
        description: formData.description,
        doubleSharingPrice: formData.doubleSharingPrice,
        fourSharingPrice: formData.fourSharingPrice,
        googleMapUrl: formData.googleMapUrl,
        images: uploadedImages,
        price: formData.price,
        singleSharingPrice: formData.singleSharingPrice,
        sixSharingPrice: formData.sixSharingPrice,
        tripleSharingPrice: formData.tripleSharingPrice,
        virtualVideoUrl: formData.virtualVideoUrl, // Added
        preferredBy: formData.preferredBy // Added
      });

      toast.success('Property listed successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while listing the property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h5>List Your Property</h5>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${activeTab === 1 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(1)}
          >
            Step 1 {stepErrors[0] && <FontAwesomeIcon icon={faExclamationCircle} className="ml-1 text-danger" />}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 2 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(2)}
          >
            Step 2 {stepErrors[1] && <FontAwesomeIcon icon={faExclamationCircle} className="ml-1 text-danger" />}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 3 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(3)}
          >
            Step 3 {stepErrors[2] && <FontAwesomeIcon icon={faExclamationCircle} className="ml-1 text-danger" />}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 4 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(4)}
          >
            Step 4 {stepErrors[3] && <FontAwesomeIcon icon={faExclamationCircle} className="ml-1 text-danger" />}
          </button>
        </div>
        <div className={`${styles.tabContent} modal-body`}>
          <div className={`${styles.tabPane} ${activeTab === 1 ? styles.active : ''}`}>
            <form>
              <div className="form-group">
                <label htmlFor="hostelName">Hostel Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="hostelName"
                  name="hostelName"
                  value={formData.hostelName}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.hostelName && <p className="text-danger">Hostel name is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.address && <p className="text-danger">Address is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.location && <p className="text-danger">Location is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.contactNumber && <p className="text-danger">Contact number is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="totalBeds">Total Beds</label>
                <input
                  type="text"
                  className="form-control"
                  id="totalBeds"
                  name="totalBeds"
                  value={formData.totalBeds}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.totalBeds && <p className="text-danger">Total beds is required</p>}
              </div>

              <div className="form-group">
              <label htmlFor="preferredBy">Preferred By</label>
              <select
                className="form-control"
                id="preferredBy"
                name="preferredBy"
                value={formData.preferredBy}
                onChange={handleInputChange}
              >
                <option value="Choose">Choose here</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Unisex">Unisex</option>
              </select>
              {stepErrors[0] && !formData.preferredBy && <p className="text-danger">Preferred By is required</p>}
            </div>


              <div className="form-group">
                <label htmlFor="googleMapUrl">Google Map URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="googleMapUrl"
                  name="googleMapUrl"
                  value={formData.googleMapUrl}
                  onChange={handleInputChange}
                />
                {stepErrors[0] && !formData.googleMapUrl && <p className="text-danger">Google Map URL is required</p>}
              </div>
            </form>
          </div>
          <div className={`${styles.tabPane} ${activeTab === 2 ? styles.active : ''}`}>
            <form>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
                {stepErrors[1] && !formData.description && <p className="text-danger">Description is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && (!formData.price || isNaN(Number(formData.price))) && <p className="text-danger">Valid price is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="singleSharingPrice">Single Sharing Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="singleSharingPrice"
                  name="singleSharingPrice"
                  value={formData.singleSharingPrice}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && formData.singleSharingPrice && isNaN(Number(formData.singleSharingPrice)) && <p className="text-danger">Valid single sharing price is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="doubleSharingPrice">Double Sharing Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="doubleSharingPrice"
                  name="doubleSharingPrice"
                  value={formData.doubleSharingPrice}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && formData.doubleSharingPrice && isNaN(Number(formData.doubleSharingPrice)) && <p className="text-danger">Valid double sharing price is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="tripleSharingPrice">Triple Sharing Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="tripleSharingPrice"
                  name="tripleSharingPrice"
                  value={formData.tripleSharingPrice}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && formData.tripleSharingPrice && isNaN(Number(formData.tripleSharingPrice)) && <p className="text-danger">Valid triple sharing price is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="fourSharingPrice">Four Sharing Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="fourSharingPrice"
                  name="fourSharingPrice"
                  value={formData.fourSharingPrice}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && formData.fourSharingPrice && isNaN(Number(formData.fourSharingPrice)) && <p className="text-danger">Valid four sharing price is required</p>}
              </div>
              <div className="form-group">
                <label htmlFor="sixSharingPrice">Six Sharing Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="sixSharingPrice"
                  name="sixSharingPrice"
                  value={formData.sixSharingPrice}
                  onChange={handleInputChange}
                />
                {stepErrors[1] && formData.sixSharingPrice && isNaN(Number(formData.sixSharingPrice)) && <p className="text-danger">Valid six sharing price is required</p>}
              </div>
            </form>
          </div>
          <div className={`${styles.tabPane} ${activeTab === 3 ? styles.active : ''}`}>
            <form>
              <div className="form-group">
                <h6 style={{textAlign:'center',marginTop:'20px', marginBottom:'30px', fontWeight:'bold'}}>Check Amenities & Services</h6>
                <div className={styles.amenitiesContainer}>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className={`form-check mr-3 ${styles.amenityItem}`}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`amenity-${index}`}
                        checked={amenity.selected}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <label className="form-check-label" htmlFor={`amenity-${index}`}>
                        <FontAwesomeIcon icon={iconMap[amenity.name]} /> {amenity.name}
                      </label>
                    </div>
                  ))}
                </div>
                {stepErrors[2] && !formData.amenities.some((amenity) => amenity.selected) && <p className="text-danger">At least one amenity must be selected</p>}
              </div>
            </form>
          </div>
          <div className={`${styles.tabPane} ${activeTab === 4 ? styles.active : ''}`}>
            <form>
            <div className="form-group">
            <label htmlFor="virtualVideoUrl">Virtual Video URL</label>
            <input
              type="text"
              className="form-control"
              id="virtualVideoUrl"
              name="virtualVideoUrl"
              value={formData.virtualVideoUrl}
              onChange={handleInputChange}
            />
            {stepErrors[3] && !formData.virtualVideoUrl && <p className="text-danger">Virtual Video URL is required</p>}
          </div>

              <div className="form-group">
                <label htmlFor="images">Upload Images</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  onChange={handleImageUpload}
                  multiple
                />
                <div className="d-flex flex-wrap mt-3">
                  {selectedImages.map((image, index) => (
                    <div key={index} className={`${styles.imagePreview} mr-2 mb-2`}>
                      <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="img-thumbnail" />
                      <button
                        type="button"
                        className={`${styles.removeImageButton} btn btn-danger btn-sm`}
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.modalFooter}>
          {activeTab < 4 && (
            <div className={styles.buttonContainer}>
            <button className="btn btn-success" style={{ marginTop: '20px', width:'150px' }} onClick={handleNext}>
              Next
            </button>
          </div>
          )}
          {activeTab === 4 && (
             <div className={styles.submitbuttonContainer}>
            <button className="btn btn-success" style={{width:'150px'}} onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddPropertyModal;
