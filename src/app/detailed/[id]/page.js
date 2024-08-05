"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './detailedpage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faSnowflake, faCouch, faCoffee, faDumbbell, faShower, faTshirt, faBed, faTv, faTint, faBatteryHalf, faJugDetergent, faSoap } from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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


  useEffect(() => {
    if (id) {
      axios.get(`/api/getPropertyById?id=${id}`)
        .then(response => {
          setProperty(response.data);
        })
        .catch(error => {
          console.error('Error fetching property details:', error);
        });
    }
  }, [id]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.containerDpage}>
      <div className={styles.hostelInfo}>
        <h1 className={styles.hostelName}>{property.hostelName}</h1>
        <p className={styles.hostelLocation}>{property.location}</p>
      </div>
      <div className={styles.gridContainer}>
        <div className={styles.carouselContainer}>
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            emulateTouch={true}
            onClickItem={() => setIsFullScreen(true)}
          >
            {property.images.map((image, index) => (
              <div key={index}>
                <img src={image} className={styles.carouselImage} alt={`Hostel Image ${index + 1}`} />
              </div>
            ))}
          </Carousel>
          <div className={styles.hostelInfoMobile}>
            <h1 className={styles.hostelName}>{property.hostelName}</h1>
            <p className={styles.hostelLocation}>{property.location}</p>
          </div>
          <div className={styles.descriptionContainer}>
            <h2 className={styles.descriptionTitle}>About</h2>
            <div className={styles.descriptionWrapper}>
              <p className={`${styles.descriptionText} ${isExpanded ? styles.expanded : styles.truncated}`}>
                {property.description}
              </p>
              <button onClick={toggleDescription} className={styles.toggleButton}>
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>
          </div>

          <div className={styles.amenitiesContainer}>
          <h2 className={styles.amenitiesTitle}>Amenities</h2>
          <ul className={styles.amenitiesList}>
            {property.amenities
              .filter(amenity => amenity.selected) // Only include amenities where selected is true
              .map((amenity, index) => (
                <li key={index} className={styles.amenityItem}>
                  <FontAwesomeIcon icon={iconMap[amenity.name]} className={styles.icon} />
                  <div className={styles.amenityName}>{amenity.name}</div>
                </li>
              ))}
          </ul>
        </div>
        </div>
        
        <div className={styles.rightContainer}>
          {/* Add your content for the right side here */}
          Right side content goes here
        </div>
      </div>
      <div className={styles.fixedBottomContainer}>
        <div className={styles.topSection}>
          <div className={styles.priceLabel}>Price starting from</div>
        </div>
        <div className={styles.priceContainer}>
          <div className={styles.fixedPrice}>₹{property.price}<span style={{fontSize:'10px',color:'grey'}}>&nbsp;/month</span></div>
          <button className={styles.requestCallbackButton}>Request Callback</button>
        </div>
      </div>
      {isFullScreen && (
        <div className={styles.fullScreenOverlay} onClick={() => setIsFullScreen(false)}>
          <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} emulateTouch={true}>
            {property.images.map((image, index) => (
              <div key={index}>
                <img src={image} className={styles.fullScreenImage} alt={`Hostel Image ${index + 1}`} />
              </div>
            ))}
          </Carousel>
          <button className={styles.closeButton} onClick={() => setIsFullScreen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
