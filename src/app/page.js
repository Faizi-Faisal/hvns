'use client'


import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs, faPerson , faWifi, faBath, faPersonDress, faFilter, faBars, faTimes, faHandshake, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './accordion.css'; // Import custom accordion CSS
import Lottie from 'react-lottie';
import animationData from '../data/Animation.json';
import PropertiesSection from "./PropertiesSection";



export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filters = {
    Location: ['Location Option 1', 'Location Option 2', 'Location Option 3'],
    Price: ['Price Option 1', 'Price Option 2', 'Price Option 3'],
    Gender: ['Male', 'Female', 'Other'],
    Popularity: ['Most Popular', 'Least Popular', 'Average']
  };

  const [location, setLocation] = useState('');



  const toggleDropdown = (filter) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  const handleOptionSelect = () => {
    setSelectedFilter(null);
  };
  
  
  const handleIndicatorClick = (index) => {
    setSelectedIndex(index);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // You might want to convert latitude and longitude to an address here
          // For simplicity, we'll just use latitude and longitude
          setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
        },
        (error) => {
          console.error('Error fetching location:', error);
          setLocation('Unable to retrieve location');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocation('Geolocation not supported');
    }
  };
  

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  //   const fetchProperties = async () => {
  //     try {
  //       const response = await fetch('/api/getProperties');
  //       if (!response.ok) {
  //         console.error('Fetch error:', response.status, response.statusText);
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       console.log('Fetched properties:', data);
  //       setProperties(data);
  //     } catch (error) {
  //       console.error('Fetch error:', error);
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProperties();
   
  // }, []);



  // if (loading) {
  //   return (
  //     <div className={styles.centeredContainer}>
  //       <Lottie options={{ loop: true, autoplay: true, animationData }} height={100} width={100} />
  //     </div>
  //   );
  // }


  // if (error) return <p>Error: {error}</p>;

  return (
    <div className={`${styles.container} container`}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/">Logo</a>
        </div>
        <nav className={styles.nav}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#about" className={styles.navLink}>About</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </nav>
        <div className={styles.listProperty}>
          <a href="#list-property" className={styles.listPropertyLink}>Partners Program <FontAwesomeIcon icon={faHandshake} /></a>
        </div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </div>
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
          <a href="#home" className={styles.mobileNavLink}>Home</a>
          <a href="#about" className={styles.mobileNavLink}>About</a>
          <a href="#contact" className={styles.mobileNavLink}>Contact</a>
          <a href="#list-property" className={styles.mobileNavLink}>List Your Property</a>
        </div>
      </header>

      <section className={styles.carouselSection} >
  <Carousel
    selectedItem={selectedIndex}
    showArrows={true}
    showThumbs={false}
    infiniteLoop={true}
    autoPlay={true}
    emulateTouch={true}
    showStatus={false}
    renderIndicator={() => null}
    onChange={(index) => setSelectedIndex(index)}
    className={styles.carousel}
  >
    <div>
      <img
        src="https://www.stanzaliving.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fstanza-living%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1688556552%2FWebsite%2FCMS-Uploads%2FWeb_Banner_03_Desktop_1_vzb4dj.png&w=1920&q=75"
        alt="Image 1"
      />
    </div>
    <div>
      <img
        src="https://www.stanzaliving.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fstanza-living%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1688556582%2FWebsite%2FCMS-Uploads%2FWeb_Banner_03_Desktop_3_mknpwg.png&w=1920&q=75"
        alt="Image 2"
      />
    </div>
    <div>
      <img
        src="https://www.stanzaliving.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fstanza-living%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1688556616%2FWebsite%2FCMS-Uploads%2FWeb_Banner_Desktop_2_fukrjc.png&w=1920&q=75"
        alt="Image 3"
      />
    </div>
  </Carousel>
  <div className={styles.customIndicators}>
    {[0, 1, 2].map((index) => (
      <span
        key={index}
        className={`${styles.indicator} ${index === selectedIndex ? styles.selected : ""}`}
        onClick={() => handleIndicatorClick(index)}
      />
    ))}
  </div>
  <div className={styles.searchContainer}>
    <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginLeft:'10px'}}/>
  <input
      type="text"
      className={styles.searchInput}
      placeholder="Search Hostels and Pg's Nearby......."
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
    <FontAwesomeIcon icon={faLocationCrosshairs} style={{fontSize: '24px',marginRight:'20px',color:'#80AF81',cursor:'pointer'}}
    onClick={fetchLocation}
    />
  </div>
</section>


      {/* New Filter Section */}
      <h6 className={styles.sfilter} style={{color:'grey'}}>Sort By filter <FontAwesomeIcon icon={faFilter} /></h6>
      <section className={styles.filterSection}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12">
            <div className={styles.filterBox}>
              <div className={styles.filterButtonContainer}>
                {['Price', 'Gender', 'Popularity', 'Location'].map((filter, index) => (
                  <div key={filter} className={`${styles.filterButtonWrapper} ${index >= 3 && 'd-none d-md-block'}`}>
                    <button
                      className={styles.filterButton}
                      onClick={() => toggleDropdown(filter)}
                    >
                      {filter}
                    </button>
                    {selectedFilter === filter && (
                      <div className={styles.fdropdown}>
                        <ul>
                          {filters[filter].map((option, idx) => (
                            <li key={idx}>
                              <a href="#" onClick={() => handleOptionSelect(option)}>{option}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-none d-md-block">
            <div className={styles.filterText}>
              {/* Add your text here */}
              <p>Additional Information or Text Here</p>
            </div>
          </div>
        </div>
      </section>
      
       <PropertiesSection />


                    {/* Frequently asked question */}

       <section className="accordion-container mt-5">
      <h2 className="accordian-faq-header mt-2">Frequently Asked Questions (FAQs)</h2>
      <div className="accordion-item">
        <div className="accordion-header mt-2" onClick={() => toggleAccordion(0)}>
          <span>What amenities are offered at heavens living  With food?</span>
          <span>{activeIndex === 0 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 0 ? 'show' : ''}`}>
          <p>At Heavens living residents can enjoy fully furnished rooms with comfortable beds, wardrobes, and study tables, high-speed Wi-Fi, 24/7 power backup, and purified drinking water. Additional amenities include daily housekeeping services, laundry facilities, nutritious meals prepared in-house, lounges, recreational zones, and gym facilities.</p>
        </div>
      </div>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(1)}>
          <span>Are there any specific rules or regulations for residents at heavens living With food PGs for girls & boys?</span>
          <span>{activeIndex === 1 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 1 ? 'show' : ''}`}>
          <p>Yes, to ensure a harmonious living environment, we have set some basic rules and regulations for our residents. These include maintaining cleanliness, adhering to noise levels after certain hours, Detailed rules will be shared upon booking confirmation.</p>
        </div>
      </div>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(2)}>
          <span> What is the accommodation capacity of Heavens living  With food?</span>
          <span>{activeIndex === 2 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 2 ? 'show' : ''}`}>
          <p>Our PGs in With food offer various accommodation options, including single, double, and triple occupancy rooms. The total capacity varies depending on the property, but we ensure that each resident has ample space and comfort. Specific capacity details can be provided based on the exact property you are interested in.</p>
        </div>
      </div>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(3)}>
          <span> What are the different room options available at Heavens living? </span>
          <span>{activeIndex === 3 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 3 ? 'show' : ''}`}>
          <p> We offer a variety of room configurations to suit different preferences and budgets. These include single occupancy rooms for those who prefer privacy, double occupancy rooms for shared living, and triple occupancy rooms for more affordable options. Each room is well-furnished and equipped with modern amenities.</p>
        </div>
      </div>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(4)}>
          <span>Are there any additional charges or hidden fees associated with the heavens living?</span>
          <span>{activeIndex === 4 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 4 ? 'show' : ''}`}>
          <p>At Heavens living, we believe in transparency. The monthly rent covers all basic amenities including Wi-Fi, housekeeping, and meals. Any additional services, such as laundry or special meal requests, may incur extra charges, which will be clearly communicated during the booking process. There are no hidden fees.</p>
        </div>
      </div>
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => toggleAccordion(5)}>
          <span>Does heavens living properties have a power backup and a water purifier?</span>
          <span>{activeIndex === 5 ? '-' : '+'}</span>
        </div>
        <div className={`accordion-content ${activeIndex === 5 ? 'show' : ''}`}>
          <p>Yes, all our PG properties in With food come equipped with 24/7 power backup to ensure uninterrupted electricity supply. We also provide purified drinking water through advanced water purifiers installed in our facilities.</p>
        </div>
      </div>
      {/* Add more accordion items as needed */}
    </section>


    </div>
  );
}
