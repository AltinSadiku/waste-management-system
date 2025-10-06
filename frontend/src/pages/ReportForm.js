import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { reportsAPI } from '../services/api';
import { MapPin, Camera, AlertCircle, Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportForm = () => {
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, setValue, watch, trigger } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      type: 'OVERFLOWING_BIN',
      priority: 'MEDIUM',
      address: '',
    }
  });

  const watchedFields = watch();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setValue('latitude', coords.latitude);
        setValue('longitude', coords.longitude);
        toast.success('Location obtained successfully!');
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += error.message;
        }
        toast.error(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const validateImage = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      return 'Please select only image files (JPG, PNG, GIF, WebP)';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const errors = [];
    const validImages = [];
    
    fileArray.forEach((file, index) => {
      const error = validateImage(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validImages.push(file);
      }
    });
    
    if (errors.length > 0) {
      toast.error(errors.join(', '));
    }
    
    if (validImages.length > 0) {
      const remainingSlots = 5 - images.length;
      const imagesToAdd = validImages.slice(0, remainingSlots);
      setImages(prev => [...prev, ...imagesToAdd]);
      
      if (validImages.length > remainingSlots) {
        toast.error(`Only ${remainingSlots} more images can be added`);
      }
    }
  };

  const handleFileInput = (e) => {
    handleImageUpload(e.target.files);
    e.target.value = ''; // Reset input
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (!location.latitude || !location.longitude) {
      toast.error('Please get your current location before submitting');
      return;
    }

    setSubmitting(true);
    
    try {
      const reportData = {
        ...data,
        latitude: location.latitude,
        longitude: location.longitude,
        address: data.address || 'Location obtained via GPS',
      };

      await reportsAPI.createReport(reportData, images);
      toast.success('Report submitted successfully! We\'ll review it shortly.');
      navigate('/reports');
    } catch (error) {
      console.error('Report submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(`Failed to submit report: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Report a Waste Issue</h1>
              <p className="text-blue-100 mt-1">Help keep our community clean by reporting waste problems</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Issue Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 5, message: 'Title must be at least 5 characters' },
                    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.title 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                      : watchedFields.title && !errors.title
                      ? 'border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  placeholder="e.g., Overflowing bin near city center"
                />
                {watchedFields.title && !errors.title && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Description *
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  rows={4}
                  {...register('description', { 
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                    maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.description 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                      : watchedFields.description && !errors.description
                      ? 'border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  placeholder="Describe the issue in detail... What do you see? When did you notice it? Any additional context?"
                />
                {watchedFields.description && !errors.description && (
                  <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex justify-between items-center">
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description.message}
                  </p>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  {watchedFields.description?.length || 0}/500 characters
                </span>
              </div>
            </div>

            {/* Issue Type and Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Issue Type *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    {...register('type', { required: 'Issue type is required' })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.type 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                    }`}
                  >
                    <option value="OVERFLOWING_BIN">🗑️ Overflowing Bin</option>
                    <option value="MISSING_BIN">❌ Missing Bin</option>
                    <option value="ILLEGAL_DUMP">⚠️ Illegal Dump</option>
                    <option value="DAMAGED_BIN">🔧 Damaged Bin</option>
                    <option value="MISSED_COLLECTION">🚛 Missed Collection</option>
                    <option value="OTHER">📋 Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.type && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Priority Level *
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    {...register('priority', { required: 'Priority is required' })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.priority 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                    }`}
                  >
                    <option value="LOW">🟢 Low - Minor inconvenience</option>
                    <option value="MEDIUM">🟡 Medium - Noticeable issue</option>
                    <option value="HIGH">🟠 High - Significant problem</option>
                    <option value="URGENT">🔴 Urgent - Immediate attention needed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.priority && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Location *
              </label>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Get Your Location</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    We need your location to accurately place the report on the map
                  </p>
                  
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {locationLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-5 w-5 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </button>
                </div>
              </div>

              {location.latitude && location.longitude && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Location Obtained Successfully!</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-900 dark:text-white">
                Address (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  {...register('address', {
                    maxLength: { value: 200, message: 'Address must be less than 200 characters' }
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.address 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                      : watchedFields.address && !errors.address
                      ? 'border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                  placeholder="Street address, landmark, or building name (helps with precise location)"
                />
                {watchedFields.address && !errors.address && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {errors.address && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.address.message}
                  </p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Photos (Optional)
              </label>
              
              <div
                className={`relative flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {dragActive ? 'Drop photos here' : 'Upload photos'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Add photos to help us understand the issue better
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus-within:outline-none focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200"
                    >
                      <span>Choose Files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                      />
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">or drag and drop</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Supports: JPG, PNG, GIF, WebP</p>
                    <p>Max size: 10MB per file • Max files: 5</p>
                    <p>Current: {images.length}/5 photos</p>
                  </div>
                </div>
              </div>
              
              {/* Display uploaded images */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Uploaded Photos ({images.length}/5)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded text-center truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>All fields marked with * are required</span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-600/30 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !location.latitude || !isValid}
                  className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[140px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
