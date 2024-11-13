import React, { useState, useEffect } from 'react';

const hotels = [
  { id: 1, name: 'Luxury Palace', image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg' },
  { id: 2, name: 'Elite Retreat', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg' },
  { id: 3, name: 'Grand Resort', image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg' },
  { id: 4, name: 'Royal Stay', image: 'https://images.pexels.com/photos/297844/pexels-photo-297844.jpeg' },
  { id: 5, name: 'Paradise Inn', image: 'https://images.pexels.com/photos/1157784/pexels-photo-1157784.jpeg' },
  { id: 6, name: 'Serenity Hotel', image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg' },
  { id: 7, name: 'Ocean Breeze', image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg' }
];

const MainApp1 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [amount, setAmount] = useState('100');
  const [userEnteredAmount, setUserEnteredAmount] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [bookingHistory, setBookingHistory] = useState([]);

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(users => {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
          setIsLoggedIn(true);
          setCurrentPage('home');
        } else {
          alert('Invalid username or password');
        }
      })
      .catch(error => console.error('Error fetching users:', error));
  };

  // Function to handle sign-up
  const handleSignup = (e) => {
    e.preventDefault();
    if (signupUsername && signupPassword) {
      const newUser = {
        username: signupUsername,
        password: signupPassword
      };

      // Check if user already exists
      fetch('http://localhost:3001/users')
        .then(response => response.json())
        .then(users => {
          const userExists = users.some(user => user.username === signupUsername);
          if (userExists) {
            alert('Username already exists. Please choose a different username.');
          } else {
            // Add the new user to the backend
            fetch('http://localhost:3001/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newUser)
            })
              .then(() => {
                setUsername(signupUsername);
                setPassword(signupPassword);
                setIsLoggedIn(true);
                setIsSignup(false);
                setCurrentPage('home');
              })
              .catch(error => console.error('Error during sign-up:', error));
          }
        })
        .catch(error => console.error('Error fetching users:', error));
    } else {
      alert('Please fill in all fields');
    }
  };

  // Handle hotel search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredHotels(hotels); // For now, displaying all hotels
    setCurrentPage('results');
  };

  // Handle booking
  const handleBooking = (e) => {
    e.preventDefault();
    if (userEnteredAmount === amount) {
      const newBooking = {
        username,
        hotel: selectedHotel,
        checkInDate,
        checkOutDate,
        guests,
        amount,
        bookingDate: new Date().toLocaleDateString(),
      };

      // Save booking details to the backend (db.json)
      fetch('http://localhost:3001/purchaseHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      })
      .then(() => {
        alert(`Booking confirmed for ${guests} guest(s) from ${checkInDate} to ${checkOutDate} at ${selectedHotel}.`);
        setSelectedHotel(null);
        setUserEnteredAmount('');
        setCurrentPage('home');
      })
      .catch((error) => {
        console.error('Error saving booking:', error);
      });
    } else {
      alert('Entered amount does not match the required amount.');
    }
  };

  // View booking history
  const handleViewHistory = () => {
    fetch('http://localhost:3001/purchaseHistory')
      .then(response => response.json())
      .then(history => {
        // Filter history for current user
        const userHistory = history.filter(booking => booking.username === username);
        setBookingHistory(userHistory);
        setCurrentPage('history');  // Navigate to the history page
      })
      .catch(error => console.error('Error fetching purchase history:', error));
  };

  // Render page based on current state
  const renderPage = () => {
    if (!isLoggedIn) {
      return isSignup ? (
        <div style={styles.authPage}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div>
              <label style={styles.labelStyle}>Username:</label>
              <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} style={styles.inputStyle} />
            </div>
            <div>
              <label style={styles.labelStyle}>Password:</label>
              <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={styles.inputStyle} />
            </div>
            <button type="submit" style={styles.buttonStyle}>Sign Up</button>
            <button type="button" onClick={() => setIsSignup(false)} style={styles.buttonStyle}>Back to Login</button>
          </form>
        </div>
      ) : (
        <div style={styles.authPage}>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label style={styles.labelStyle}>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.inputStyle} />
            </div>
            <div>
              <label style={styles.labelStyle}>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.inputStyle} />
            </div>
            <button type="submit" style={styles.buttonStyle}>Login</button>
            <button type="button" onClick={() => setIsSignup(true)} style={styles.buttonStyle}>Sign Up</button>
          </form>
        </div>
      );
    } else {
      switch (currentPage) {
        case 'history':
          return (
            <div style={styles.page}>
              <h2>Booking History</h2>
              {bookingHistory.length > 0 ? (
                <ul>
                  {bookingHistory.map((booking, index) => (
                    <li key={index}>
                      Hotel: {booking.hotel} <br />
                      Check-in: {booking.checkInDate} <br />
                      Check-out: {booking.checkOutDate} <br />
                      Guests: {booking.guests} <br />
                      Amount: ${booking.amount} <br />
                      Booking Date: {booking.bookingDate}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No booking history found.</p>
              )}
              <button onClick={() => setCurrentPage('home')} style={styles.buttonStyle}>Back to Home</button>
            </div>
          );
        case 'home':
          return (
            <div style={styles.page}>
              <button onClick={() => setCurrentPage('home')} style={styles.navButtonStyle}>Home</button>
              <button onClick={handleViewHistory} style={styles.navButtonStyle}>View Booking History</button>
              <button onClick={() => setCurrentPage('about')} style={styles.navButtonStyle}>About Us</button>
              <button onClick={() => { setIsLoggedIn(false); setCurrentPage('home'); }} style={styles.navButtonStyle}>Log Out</button>

              <form onSubmit={handleSearch}>
                <div>
                  <label style={styles.labelStyle}>Search Location:</label>
                  <input type="text" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} style={styles.inputStyle} />
                </div>
                <div>
                  <label style={styles.labelStyle}>Check-in Date:</label>
                  <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} style={styles.inputStyle} />
                </div>
                <div>
                  <label style={styles.labelStyle}>Check-out Date:</label>
                  <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} style={styles.inputStyle} />
                </div>
                <div>
                  <label style={styles.labelStyle}>Number of Guests:</label>
                  <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} style={styles.inputStyle} />
                </div>
                <button type="submit" style={styles.buttonStyle}>Search Hotels</button>
              </form>
            </div>
          );
        case 'results':
          return (
            <div style={styles.page}>
              <h2>Available Hotels</h2>
              <ul style={styles.hotelList}>
                {filteredHotels.map((hotel) => (
                  <li key={hotel.id} style={styles.hotelItem}>
                    <img src={hotel.image} alt={hotel.name} style={styles.hotelImage} />
                    <h3>{hotel.name}</h3>
                    <button onClick={() => {
                      setSelectedHotel(hotel.name);
                      setCurrentPage('booking');
                    }} style={styles.buttonStyle}>Book Now</button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setCurrentPage('home')} style={styles.buttonStyle}>Back to Home</button>
            </div>
          );
        case 'booking':
          return (
            <div style={styles.page}>
              <h2>Booking for {selectedHotel}</h2>
              <form onSubmit={handleBooking}>
                <div>
                  <label style={styles.labelStyle}>Amount to Pay:</label>
                  <input type="text" value={amount} readOnly style={styles.inputStyle} />
                </div>
                <div>
                  <label style={styles.labelStyle}>Enter Amount:</label>
                  <input type="text" value={userEnteredAmount} onChange={(e) => setUserEnteredAmount(e.target.value)} style={styles.inputStyle} />
                </div>
                <button type="submit" style={styles.buttonStyle}>Pay Now</button>
                <button onClick={() => setCurrentPage('home')} style={styles.buttonStyle}>Cancel Booking</button>
              </form>
            </div>
          );
        case 'about':
          return (
            <div style={styles.page}>
              <h2>About Us</h2>
              <p>Welcome to our hotel booking application!</p>
              <button onClick={() => setCurrentPage('home')} style={styles.buttonStyle}>Back to Home</button>
            </div>
          );
        default:
          return <div>Page not found</div>;
      }
    }
  };

  return (
    <div style={styles.container}>
      {renderPage()}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    background: 'url("https://digital.ihg.com/is/image/ihg/cp-brand-refresh-lp-carousel-feat-1-usen-svp-1320x660") no-repeat center center fixed',
    backgroundSize: 'cover',
    minHeight: '100vh',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.6)', 
    zIndex: '-1',
  },
  page: {
    backgroundColor: '#ffffff', 
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: '1',
  },
  navStyles: {
    marginBottom: '20px',
  },
  navButtonStyle: {
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchForm: {
    marginBottom: '20px',
  },
  labelStyle: {
    display: 'block',
    marginBottom: '8px',
  },
  inputStyle: {
    padding: '10px',
    width: '100%',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonStyle: {
    padding: '10px 20px',
    backgroundColor: '#007BFF', 
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  authPage: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: '1', 
  },
  hotelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  hotelCard: {
    display: 'flex',
    backgroundColor: '#f8f8f8', 
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  hotelImage: {
    width: '150px',
    height: '100px',
    borderRadius: '8px',
  },
  hotelInfo: {
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};







export default MainApp1;
