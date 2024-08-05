import { useState } from 'react';
import { useRouter } from 'next/router';
import mongoose from 'mongoose';
import Property from '../../models/Property'; // Adjust the path if needed
import styles from './PropertyDetail.module.css'; // Adjust the path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faPersonDress } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const getIconForPreferredBy = (preferredBy) => {
  switch (preferredBy) {
    case 'Boys':
      return faPerson;
    case 'Girls':
      return faPersonDress;
    case 'Unisex':
      return faPerson;
    default:
      return faPerson;
  }
};

const PropertyDetail = ({ property }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const [newImages, setNewImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!property) {
    return <p>Property not found</p>;
  }

  const bedsOccupied = property.bedsOccupied || 0;
  const bedsVacant = property.totalBeds - bedsOccupied;

  const handleBackClick = () => {
    router.push(`/dashboard/Admin/admHl01`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setEditedProperty((prev) => ({
        ...prev,
        amenities: prev.amenities.map((amenity) =>
          amenity.name === name ? { ...amenity, checked } : amenity
        ),
      }));
    } else {
      setEditedProperty((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + editedProperty.images.length > 6) {
      alert('You can only upload up to 6 images.');
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (image) => {
    setEditedProperty((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const handleRemoveNewImage = (fileName) => {
    setNewImages((prev) => prev.filter(file => file.name !== fileName));
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    newImages.forEach((file) => formData.append('images', file));
    formData.append('property', JSON.stringify(editedProperty));

    try {
      const response = await fetch('/api/updateProperty', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Property updated successfully');
        setIsEditing(false);
        setNewImages([]); // Clear new images after saving
      } else {
        alert('Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topContainer}>
        <button className="btn btn-secondary" onClick={handleBackClick}>Back</button>
        <div className={styles.box}>
          <p><strong>Total Beds:</strong>
            {isEditing ? (
              <input
                type="number"
                name="totalBeds"
                value={editedProperty.totalBeds}
                onChange={handleChange}
                className="form-control"
                style={{ marginLeft: '10px', display: 'inline-block', width: 'auto' }}
              />
            ) : (
              <span style={{ color: 'green' }}> {property.totalBeds}</span>
            )}
          </p>
        </div>
        <div className={styles.box}>
          <p><strong>Beds Occupied:</strong><span style={{ color: 'red' }}> {bedsOccupied}</span></p>
        </div>
        <div className={styles.box}>
          <p><strong>Beds Vacant:</strong><span style={{ color: 'orange' }}> {bedsVacant}</span></p>
        </div>
        {isEditing ? (
          <>
            <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn btn-warning" onClick={handleEditClick}>Edit Details</button>
        )}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.propertyDetails}>
            <h1 className={styles.propertyName}>
              {isEditing ? (
                <input
                  type="text"
                  name="hostelName"
                  value={editedProperty.hostelName}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                editedProperty.hostelName
              )}
              &nbsp;
              <span
                className={` ${styles.cardTag} ${
                  editedProperty.preferredBy === 'Boys'
                    ? styles.boys
                    : editedProperty.preferredBy === 'Girls'
                    ? styles.girls
                    : editedProperty.preferredBy === 'Unisex'
                    ? styles.unisex
                    : ''
                }`}
              >
                <FontAwesomeIcon icon={getIconForPreferredBy(editedProperty.preferredBy)} /> {editedProperty.preferredBy}
              </span>
            </h1>
            <p className={styles.propertyLocation}>
              <strong>Location:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={editedProperty.location}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                editedProperty.location
              )}
            </p>
            <p className={styles.propertyAddress}>
              <strong>Address:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedProperty.address}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                editedProperty.address
              )}
            </p>
            <p className={styles.propertyContact}>
              <strong>Contact Number:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="contactNumber"
                  value={editedProperty.contactNumber}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                editedProperty.contactNumber || 'Not Available'
              )}
            </p>
            
          </div>

          <div className={styles.imageContainer}>
            {editedProperty.images.length > 0 && (
              <div className={styles.mainImage}>
                <img
                  src={editedProperty.images[0]}
                  alt="Main Property"
                  onClick={() => handleImageClick(editedProperty.images[0])}
                />
                {isEditing && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveImage(editedProperty.images[0])}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="form-control"
                />
                <div className={styles.newImagePreviews}>
                  {newImages.map((file, index) => (
                    <div key={index} className={styles.newImagePreview}>
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className={styles.previewImage} />
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveNewImage(file.name)}
                      >
                        Remove
                      </button>
                      <p>{file.name}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className={styles.thumbnailContainer}>
              {editedProperty.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>

          <div className={styles.price}>
            <h3>Price:</h3>
            {isEditing ? (
              <input
                type="number"
                name="price"
                value={editedProperty.price}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <p>{editedProperty.price}</p>
            )}
          </div>

          <div className={styles.description}>
            <h3>Description:</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editedProperty.description}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <p>{editedProperty.description}</p>
            )}

<p className={styles.virtualVideoUrl}>
              <strong>Virtual Video URL:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="virtualVideoUrl"
                  value={editedProperty.virtualVideoUrl}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <a href={editedProperty.virtualVideoUrl} target="_blank" rel="noopener noreferrer">View Virtual Video</a>
              )}
            </p>

            
          <div className='d-flex justify-content-center align-items-center mt-4' style={{ width: '100%' }}>
          <button type="button" className="btn btn-outline-danger" style={{ width: '100%' }}>Delete Property</button>
        </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.amenities}>
            <h3>Amenities:</h3>
            {isEditing ? (
              <ul>
                {property.amenities.map((amenity, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        name={amenity.name}
                        checked={editedProperty.amenities.some(a => a.name === amenity.name && a.checked)}
                        onChange={handleChange}
                      />
                      {amenity.name}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Amenity</th>
                  </tr>
                </thead>
                <tbody>
                  {property.amenities.map((amenity, index) => (
                    <tr key={index}>
                      <td>{amenity.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.sharingPrices}>
            <h3>Sharing Prices:</h3>
            <ul>
              <li>
                <strong>Single Sharing:</strong>
                {isEditing ? (
                  <input
                    type="number"
                    name="singleSharingPrice"
                    value={editedProperty.singleSharingPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  editedProperty.singleSharingPrice
                )}
              </li>
              <li>
                <strong>Double Sharing:</strong>
                {isEditing ? (
                  <input
                    type="number"
                    name="doubleSharingPrice"
                    value={editedProperty.doubleSharingPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  editedProperty.doubleSharingPrice
                )}
              </li>
              <li>
                <strong>Triple Sharing:</strong>
                {isEditing ? (
                  <input
                    type="number"
                    name="tripleSharingPrice"
                    value={editedProperty.tripleSharingPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  editedProperty.tripleSharingPrice
                )}
              </li>
              <li>
                <strong>Four Sharing:</strong>
                {isEditing ? (
                  <input
                    type="number"
                    name="fourSharingPrice"
                    value={editedProperty.fourSharingPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  editedProperty.fourSharingPrice
                )}
              </li>
              <li>
                <strong>Six Sharing:</strong>
                {isEditing ? (
                  <input
                    type="number"
                    name="sixSharingPrice"
                    value={editedProperty.sixSharingPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  editedProperty.sixSharingPrice
                )}
              </li>
            </ul>
          </div>

          <div className={styles.locationLink}>
            <h3>Location on Google Maps:</h3>
            {isEditing ? (
              <input
                type="text"
                name="googleMapsLink"
                value={editedProperty.googleMapsLink}
                onChange={handleChange}
                className="form-control"
              />
            ) : (
              <a href={editedProperty.googleMapsLink} target="_blank" rel="noopener noreferrer">View Location</a>
            )}
          </div>
        </div>
      </div>


      {fullscreenImage && (
        <div className={styles.fullscreenOverlay} onClick={handleCloseFullscreen}>
          <img src={fullscreenImage} alt="Fullscreen" />
          <button className="btn btn-secondary" onClick={handleCloseFullscreen}>Close</button>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const { id } = context.query;
  const property = await Property.findById(id).lean();

  if (!property) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      property: JSON.parse(JSON.stringify(property)),
    },
  };
}

export default PropertyDetail;
