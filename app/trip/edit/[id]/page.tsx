"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '../../../components/NavigationBar';

const EditTripPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    author: '',
    distance: '',
    cities: '',
    duration: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams?.id) return;

    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${unwrappedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.error('Failed to fetch trip');
        }
      } catch (error) {
        console.error('An error occurred while fetching the trip:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [unwrappedParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setFormData((prev) => ({ ...prev, image: result.secure_url }));
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('An error occurred during image upload:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unwrappedParams?.id) return;
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/trips/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/library');
      } else {
        console.error('Failed to update trip');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('An error occurred while updating the trip:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading || !unwrappedParams) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavigationBar />
        <div className="container mx-auto px-4 pt-24 pb-8 flex justify-center items-center">
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <h2 className="text-xl font-regular mb-8 text-center">Edit your trip</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-6 flex items-center">
            <label htmlFor="title" className="w-32 pr-4 text-right text-sm font-medium">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="location" className="w-32 pr-4 text-right text-sm font-medium">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="image" className="w-32 pr-4 text-right text-sm font-medium">Image</label>
            <input type="file" id="image" name="image" onChange={handleImageUpload} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="author" className="w-32 pr-4 text-right text-sm font-medium">Author</label>
            <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="distance" className="w-32 pr-4 text-right text-sm font-medium">Distance</label>
            <input type="text" id="distance" name="distance" value={formData.distance} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="cities" className="w-32 pr-4 text-right text-sm font-medium">Cities</label>
            <input type="text" id="cities" name="cities" value={formData.cities} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-center">
            <label htmlFor="duration" className="w-32 pr-4 text-right text-sm font-medium">Duration</label>
            <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="form-input flex-1" />
          </div>
          <div className="mb-6 flex items-start">
            <label htmlFor="description" className="w-32 pr-4 text-right text-sm font-medium pt-2">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="form-input flex-1" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripPage;
