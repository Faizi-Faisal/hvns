// src/pages/api/getProperties.js
import dbConnect from '@/lib/db'; 
import Property from '@/models/Property';

export default async function handler(req, res) {
  await dbConnect();

  try {
    console.log('Fetching properties...');
    const properties = await Property.find({});
    console.log('Properties fetched:', properties);
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
}
