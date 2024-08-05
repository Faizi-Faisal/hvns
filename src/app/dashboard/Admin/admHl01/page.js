// src/app/dashboard/admin/admHl01/page.js

"use client"

import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';
import AddPropertyModal from './AddPropertyModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBuilding, faChildReaching, faGrip, faUser, faBell, faHandshake, faIndianRupeeSign, faPerson, faLocationCrosshairs, faWifi, faBath, faPen, faFingerprint, faPersonDress, faPhoneVolume, faPizzaSlice, } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icon for "plus"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from 'next/link';
import Lottie from 'react-lottie';
import animationData from '../../../../data/Animation.json';

const getIconForPreferredBy = (preferredBy) => {
  switch (preferredBy) {
    case 'Boys':
      return faPerson; // Example icon for Boys
    case 'Girls':
      return faPersonDress; // Example icon for Girls
    case 'Unisex':
      return faPerson; // Example icon for Unisex
    default:
      return faPerson; // Default icon
  }
};

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  

  const handleAddPropertyClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/getProperties');
        if (!response.ok) {
          console.error('Fetch error:', response.status, response.statusText);
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched properties:', data);
        setProperties(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
   
  }, []);



  

  if (loading) {
    return (
      <div className={styles.centeredContainer}>
        <Lottie options={{ loop: true, autoplay: true, animationData }} height={100} width={100} />
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button
          className={`${styles.menuButton} ${selectedSection === 'dashboard' ? styles.selected : ''}`}
          onClick={() => setSelectedSection('dashboard')}
        >
          <FontAwesomeIcon icon={faGrip} /> &nbsp; Dashboard
        </button>
        <button
          className={`${styles.menuButton} ${selectedSection === 'addProperty' ? styles.selected : ''}`}
          onClick={() => setSelectedSection('addProperty')}
        >
          <FontAwesomeIcon icon={faBuilding} /> &nbsp; Manage Property
        </button>
        <button
          className={`${styles.menuButton} ${selectedSection === 'manageStudents' ? styles.selected : ''}`}
          onClick={() => setSelectedSection('manageStudents')}
        >
         <FontAwesomeIcon icon={faChildReaching} /> &nbsp; Manage Students
        </button>
      </div>
      <div className={styles.content}>
  
        {selectedSection === 'dashboard' && (

            <div>
          <div className={styles.admaibox}> 
          <div>
          <h5 style={{marginBottom:'30px'}}>Add or Manage Property</h5>

          <div className={styles.propertyContainer}>
          <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick={handleAddPropertyClick}>
            <div className={styles.addPropertyContent}>
              <div className={styles.iconSquare}>
                <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
              </div>
              <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
                <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Add Property</h2> {/* Custom font size */}
              </div>
            </div>
          </div>

          <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick='#'>
            <div className={styles.addPropertyContent}>
              <div className={styles.iconSquare} style={{backgroundColor:'#A87676'}}>
                <FontAwesomeIcon icon={faPizzaSlice} className={styles.addIcon} />
              </div>
              <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
                <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Manage Food</h2> {/* Custom font size */}
              </div>
            </div>
          </div>


          </div>
          </div>
          </div>


          <div className={styles.admaibox2}> 
  <h5 style={{ marginBottom: '35px' }}>Manage Students</h5>

  <div className={styles.propertyContainer}>
    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'#1A5319'}}>
        <FontAwesomeIcon icon={faUser} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Add Student</h2> {/* Custom font size */}
        </div>
      </div>
    </div>

    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'red'}}>
          <FontAwesomeIcon icon={faBell} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Pending Request</h2> {/* Custom font size */}
        </div>
      </div>
    </div>


    {/* Add more boxes here if needed */}
  </div>
</div>


<div className={styles.admaibox3}> 
  <h5 style={{ marginBottom: '35px' }}>General</h5>

  <div className={styles.propertyContainer}>
    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'#FF76CE'}}>
        <FontAwesomeIcon icon={faHandshake} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Partner Request</h2> {/* Custom font size */}
        </div>
      </div>
    </div>

    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'#FF7D29'}}>
          <FontAwesomeIcon icon={faIndianRupeeSign} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Rent Management</h2> {/* Custom font size */}
        </div>
      </div>
    </div>

    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'#AF47D2'}}>
          <FontAwesomeIcon icon={faFingerprint} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Create User</h2> {/* Custom font size */}
        </div>
      </div>
    </div>

    <div className={`${styles.addPropertyBox} shadow p-3 mb-5 bg-white rounded`} onClick="#">
      <div className={styles.addPropertyContent}>
        <div className={styles.iconSquare} style={{backgroundColor:'#5BBCFF'}}>
          <FontAwesomeIcon icon={faPhoneVolume} className={styles.addIcon} />
        </div>
        <div className="text" style={{ fontSize: '16px' }}> {/* Adjusted font size here */}
          <h2 style={{ fontSize: '16px', marginBottom: '0' }}>Callback Request</h2> {/* Custom font size */}
        </div>
      </div>
    </div>

   

    {/* Add more boxes here if needed */}
  </div>
</div>




          </div>

          
        )}


        {selectedSection === 'addProperty' && (

        <div>
      <h4>Manage Your Listed Property</h4>
      <section className={styles.topPGSection}>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      {properties.length > 0 ? (
          properties.map((property) => (
            <Link href={`/property/${property._id}`} key={property._id} style={{textDecoration:'none'}}>
      <div className="col mb-4">
      <div className={`${styles.cardCustomSize} card mt-4 shadow-sm`}>
        {/* Hostel image carousel */}
        <div className="position-relative">
                <span
          className={`badge ${styles.cardTag} ${
            property.preferredBy === 'Boys'
              ? styles.boys
              : property.preferredBy === 'Girls'
              ? styles.girls
              : property.preferredBy === 'Unisex'
              ? styles.unisex
              : ''
          }`}
>
  <FontAwesomeIcon icon={getIconForPreferredBy(property.preferredBy)} /> {property.preferredBy}
</span>

          <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} emulateTouch={true}>
            {property.images.map((image, index) => (
              <div key={index}>
                <img src={image} className="card-img-top" alt={`Hostel Image ${index + 1}`} style={{ borderTopLeftRadius: '20px' }}/>
              </div>
            ))}
          </Carousel>
        </div>
        {/* Card details */}
        <div className="card-body">
          <h5 className={styles.cardtitle}>{property.hostelName}</h5>
          <p className="card-text d-flex justify-content-between align-items-center">
            <span className={styles.cardlocation}>{property.location}</span>
            <a href={property.googleMapUrl} className={styles.cardmaptext} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><FontAwesomeIcon icon={faLocationCrosshairs} className="me-1" />Location</a>
          </p>

          <div className="d-flex mb-3 mt-4">
            {/* Amenity boxes */}
            <div className={`${styles.amenityBox} ${styles.box1}`}>
              <span className={styles.amenityText}><FontAwesomeIcon icon={faWifi} /> &nbsp;Wifi</span>
            </div>
            <div className={`${styles.amenityBox} ${styles.box2}`}>
              <span className={styles.amenityText}><FontAwesomeIcon icon={faBath} /> &nbsp;Attached Washroom</span>
            </div>
          </div>
          <p className={styles.cardprice}>₹{property.price} <span className={styles.cardmnth}>/mo* <span className={styles.sprice}>Starting Price</span></span></p>
          <div className="d-flex justify-content-between">
            <a href="#" className={styles.exbutton}>Edit Details &nbsp; <FontAwesomeIcon icon={faPen} onClick={() => router.push(`/property/${property._id}`)} /></a>
          </div>
        </div>
      </div>
      </div>
      </Link>
      ))
    ) : (
      <div className="col mb-4">
        <div className={`${styles.cardCustomSize} card mt-4`}>
          <div className="card-body text-center">
            <p>No properties available. <a href="/manage-properties">List property to manage</a></p>
          </div>
        </div>
      </div>
    )}
      </div>
      </section>
      </div>
      
              )}







        {selectedSection === 'manageStudents' && <h2>Manage Students</h2>}
      </div>
      {showModal && <AddPropertyModal onClose={handleCloseModal} />}
    </div>
    </>
  );
};

export default AdminDashboard;
