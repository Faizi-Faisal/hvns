// src/pages/api/getPropertyById.js
import dbConnect from '@/lib/db'; 
import Property from '@/models/Property';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
}
