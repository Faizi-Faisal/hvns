// src/app/PropertiesSection.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs, faWifi, faBath, faPerson, faPersonDress } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

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

const PropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className={styles.topPGSection}>
      <h2 className={styles.toppgBnglr}>Explore Top PG's in <span className={styles.bangalore}>Bangalore</span></h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div 
              className="col mb-4" 
              key={property._id} 
              onClick={() => router.push(`/detailed/${property._id}`)}
            >
              <div className={`${styles.cardCustomSize} card`}>
                <div className="position-relative">
                  <span className={`badge ${styles.cardTag} ${
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
                        <img src={image} className="card-img-top" alt={`Hostel Image ${index + 1}`} style={{ borderTopLeftRadius: '20px',}}/>
                      </div>
                    ))}
                  </Carousel>
                </div>
                <div className="card-body">
                  <h5 className={styles.cardtitle}>{property.hostelName}</h5>
                  <p className="card-text d-flex justify-content-between align-items-center">
                    <span className={styles.cardlocation}>{property.location}</span>
                    <a href={property.googleMapUrl} target="_blank" rel="noopener noreferrer" className={styles.cardmaptext}>
                      <FontAwesomeIcon icon={faLocationCrosshairs} className="me-1" />Location
                    </a>
                  </p>
                  <div className="d-flex mb-3 mt-4">
                    <div className={`${styles.amenityBox} ${styles.box1}`}>
                      <span className={styles.amenityText}><FontAwesomeIcon icon={faWifi} /> &nbsp;Wifi</span>
                    </div>
                    <div className={`${styles.amenityBox} ${styles.box2}`}>
                      <span className={styles.amenityText}><FontAwesomeIcon icon={faBath} /> &nbsp;Attached Washroom</span>
                    </div>
                  </div>
                  <p className={styles.cardprice}>₹{property.price} <span className={styles.cardmnth}>/mo* <span className={styles.sprice}>Starting Price</span></span></p>
                  <div className="d-flex justify-content-between">
                    <a href="#" className={styles.exbutton}>Explore PG</a>
                    <a href="#" className={styles.reqbutton}>Request Callback</a>
                  </div>
                </div>
              </div>
            </div>
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
  );
};

export default PropertiesSection;
