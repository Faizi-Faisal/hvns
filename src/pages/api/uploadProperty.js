import dbConnect from '@/lib/db'; 
import Property from '@/models/Property';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract data from the request
      const {
        hostelName, address, location, contactNumber, totalBeds, amenities, description,
        doubleSharingPrice, fourSharingPrice, googleMapUrl, images, price, singleSharingPrice,
        sixSharingPrice, tripleSharingPrice, preferredBy, virtualVideoUrl
      } = req.body;

      // Connect to the database
      await dbConnect();
      
      // Insert data into MongoDB
      const result = await Property.create({
        hostelName, address, location, contactNumber, totalBeds, amenities, description,
        doubleSharingPrice, fourSharingPrice, googleMapUrl, images, price, singleSharingPrice,
        sixSharingPrice, tripleSharingPrice, preferredBy, virtualVideoUrl
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error saving property', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
