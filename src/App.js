import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import awsExports from './aws-exports';
import countriesData from './data/countries.json';
import './App.css';

Amplify.configure(awsExports);

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSignUp = async (formData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.username || !formData.email || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }
      
      console.log('Form data:', formData);
      
      const signUpData = {
        username: formData.username,
        password: formData.password,
        attributes: {
          email: formData.email
        }
      };
      
      console.log('SignUp data:', signUpData);
      
      await signUp(signUpData);
      alert('Registration successful! You can now sign in.');
    } catch (error) {
      console.error('SignUp error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (formData) => {
    try {
      setLoading(true);
      await signIn({
        username: formData.usernameOrEmail,
        password: formData.password
      });
      await checkAuthState();
      setShowAuthModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setPosts([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const createPost = () => {
    if (postInput.trim() || selectedImage) {
      const newPost = {
        id: Date.now(),
        content: postInput,
        image: selectedImage,
        author: user.username,
        timestamp: new Date().toLocaleString('en-US'),
        likes: 0,
        comments: [],
        isLiked: false
      };
      setPosts([newPost, ...posts]);
      setPostInput('');
      setSelectedImage(null);
    }
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-700 to-yellow-800">
        <nav className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🍳</span>
            <span className="text-white font-bold text-xl">Taste Driven Healthy Virtual AI</span>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-amber-900/30 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-900/50 transition-all border border-amber-400/30"
          >
            Join Now
          </button>
        </nav>

        <div className="flex items-center justify-center min-h-[80vh] text-center px-4">
          <div className="max-w-4xl">
            <div className="text-7xl mb-6">🍳📱✨</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Connect Your Cooking Passion
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover new flavors, share recipes, connect with friends
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-amber-900/20 backdrop-blur-sm p-6 rounded-2xl border border-amber-400/20">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-white font-semibold mb-2">Smart AI</h3>
                <p className="text-white/80 text-sm">Get recipe suggestions and nutrition insights</p>
              </div>
              <div className="bg-amber-900/20 backdrop-blur-sm p-6 rounded-2xl border border-amber-400/20">
                <div className="text-3xl mb-3">📸</div>
                <h3 className="text-white font-semibold mb-2">Share Dishes</h3>
                <p className="text-white/80 text-sm">Capture and share your delicious creations</p>
              </div>
              <div className="bg-amber-900/20 backdrop-blur-sm p-6 rounded-2xl border border-amber-400/20">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-white font-semibold mb-2">Community</h3>
                <p className="text-white/80 text-sm">Connect with fellow cooking enthusiasts</p>
              </div>
            </div>
          </div>
        </div>

        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
            loading={loading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🍳</span>
            </div>
            <h1 className="text-xl font-bold text-amber-700">Taste Driven Healthy Virtual AI</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg font-medium ${activeTab === 'home' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-amber-600'}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setActiveTab('discover')}
              className={`px-3 py-2 rounded-lg font-medium ${activeTab === 'discover' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-amber-600'}`}
            >
              🔍 Discover
            </button>
            <button 
              onClick={() => setActiveTab('recipes')}
              className={`px-3 py-2 rounded-lg font-medium ${activeTab === 'recipes' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-amber-600'}`}
            >
              📖 Recipes
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user.username}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your delicious creation..."
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                rows="3"
              />
              
              {selectedImage && (
                <div className="mt-3 relative">
                  <img src={selectedImage} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 cursor-pointer">
                    <span>📷</span>
                    <span className="text-sm">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-amber-600">
                    <span>🏷️</span>
                    <span className="text-sm">Tag Dish</span>
                  </button>
                </div>
                <button
                  onClick={createPost}
                  disabled={!postInput.trim() && !selectedImage}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                
                {post.content && (
                  <p className="text-gray-800 mb-4">{post.content}</p>
                )}
              </div>
              
              {post.image && (
                <div className="w-full">
                  <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
                </div>
              )}
              
              <div className="p-6 pt-4">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>🤖</span>
                    <span className="font-semibold text-amber-700">AI Food Analysis</span>
                  </div>
                  <div className="text-sm text-amber-600 space-y-1">
                    <p>🍽️ Dish: Analyzing...</p>
                    <p>⚡ Calories: Calculating...</p>
                    <p>🥗 Nutrition: Processing...</p>
                    <p>⭐ Rating: Looks delicious!</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <span>{post.isLiked ? '❤️' : '🤍'}</span>
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                      <span>💬</span>
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500">
                      <span>📤</span>
                      <span>Share</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-amber-500">
                    <span>🔖</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to share a delicious dish!</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-400">
                <span>📸 Take a photo</span>
                <span>•</span>
                <span>✍️ Write description</span>
                <span>•</span>
                <span>🤖 Get AI analysis</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AuthModal = ({ onClose, onSignUp, onSignIn, loading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    usernameOrEmail: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    allergies: ''
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const filteredCountries = countriesData.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value)
      });
    }
  };

  const handleCountrySearch = (e) => {
    setCountrySearch(e.target.value);
    setShowCountryDropdown(true);
  };

  const selectCountry = (country) => {
    setFormData({ ...formData, nationality: country.name });
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await onSignIn(formData);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      await onSignUp(formData);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">Join the cooking community</p>
        </div>

        <div className="mb-4 text-center">
          <div className="flex justify-center bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-amber-700 shadow-sm' 
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-amber-700 shadow-sm' 
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isLogin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email *
                </label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  placeholder="Enter username or email"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter unique username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🔒' : '👀'}
                  </button>
                </div>
                {formData.password && !isPasswordValid && (
                  <div className="mt-2 space-y-1">
                    {!passwordValidation.length && (
                      <div className="text-xs flex items-center text-red-600">
                        <span className="mr-1">✗</span>
                        At least 8 characters
                      </div>
                    )}
                    {!passwordValidation.uppercase && (
                      <div className="text-xs flex items-center text-red-600">
                        <span className="mr-1">✗</span>
                        One uppercase letter
                      </div>
                    )}
                    {!passwordValidation.lowercase && (
                      <div className="text-xs flex items-center text-red-600">
                        <span className="mr-1">✗</span>
                        One lowercase letter
                      </div>
                    )}
                    {!passwordValidation.number && (
                      <div className="text-xs flex items-center text-red-600">
                        <span className="mr-1">✗</span>
                        One number
                      </div>
                    )}

                  </div>
                )}
                {formData.password && isPasswordValid && (
                  <div className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">✓</span>
                    Password meets all requirements
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? '🔒' : '👀'}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="text-xs text-red-600 mt-1 flex items-center">
                    <span className="mr-1">✗</span>
                    Passwords do not match
                  </div>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                  <div className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">✓</span>
                    Passwords match
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality *
                </label>
                <input
                  type="text"
                  placeholder="Search and select country"
                  value={countrySearch}
                  onChange={handleCountrySearch}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  required
                />
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredCountries.map(country => (
                      <div
                        key={country.code}
                        onClick={() => selectCountry(country)}
                        className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-sm"
                      >
                        {country.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (Optional)
                </label>
                <input
                  type="text"
                  name="allergies"
                  placeholder="e.g. nuts, dairy, shellfish (comma separated)"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (!isLogin && !isPasswordValid)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;