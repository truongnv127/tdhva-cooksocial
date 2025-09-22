import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import countries from '../data/countries.json';

function Auth() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    birthdate: '',
    gender: '',
    nationality: '',
    allergies: ''
  });

  // Input sanitization function
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>"'&]/g, '').trim();
  };

  // Validate input fields
  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.birthdate || !formData.gender) {
      alert('Please fill in all required fields');
      return false;
    }
    if (formData.username.length < 3) {
      alert('Username must be at least 3 characters');
      return false;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return false;
    }
    return true;
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const sanitizedData = {
        username: sanitizeInput(formData.username),
        password: formData.password, // Don't sanitize password
        email: sanitizeInput(formData.email),
        birthdate: formData.birthdate,
        gender: formData.gender,
        nationality: formData.nationality,
        allergies: sanitizeInput(formData.allergies)
      };
      
      const { user } = await signUp({
        username: sanitizedData.username,
        password: sanitizedData.password,
        attributes: {
          email: sanitizedData.email,
          birthdate: sanitizedData.birthdate,
          gender: sanitizedData.gender,
          preferred_username: sanitizedData.username,
          'custom:nationality': sanitizedData.nationality,
          'custom:allergies': sanitizedData.allergies
        }
      });
      console.log('Sign up success:', user);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Sign up failed: ' + error.message);
    }
  };





  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>TDH Cook Social</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="date"
          value={formData.birthdate}
          onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
          required
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={formData.nationality}
          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        >
          <option value="">Nationality (optional)</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <button type="submit" style={{ padding: '10px 20px', margin: '10px 0' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Auth;