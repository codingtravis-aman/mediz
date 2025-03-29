import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Clock, Phone, Mail, ArrowLeft, ExternalLink, Truck } from 'lucide-react';
import { getPharmacy } from '../../lib/api';
import { Pharmacy } from '../../lib/types';

const PharmacyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const { data: pharmacy, isLoading, error } = useQuery({
    queryKey: ['pharmacy', parseInt(id)],
    queryFn: () => getPharmacy(parseInt(id)),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Loading pharmacy details...</p>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Error loading pharmacy</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the pharmacy you're looking for.</p>
        <Button onClick={() => setLocation('/pharmacies')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Pharmacies
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => setLocation('/pharmacies')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to pharmacies
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{pharmacy.name}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {pharmacy.address}, {pharmacy.city}, {pharmacy.state} - {pharmacy.pincode}
              </CardDescription>
            </div>
            {pharmacy.rating && (
              <Badge variant="secondary" className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-current" /> 
                {pharmacy.rating.toFixed(1)} ({pharmacy.reviewCount} reviews)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{pharmacy.phone}</span>
            </div>
            {pharmacy.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{pharmacy.email}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{pharmacy.hours || 'Hours not available'}</span>
            </div>
            {pharmacy.deliveryAvailable && (
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Delivery: Free over ₹{pharmacy.minimumOrderAmount}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">About {pharmacy.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pharmacy.name} is a reliable pharmacy offering a wide range of medications and healthcare products.
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex justify-between">
            {pharmacy.deliveryAvailable && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated delivery time</p>
                <p className="font-medium">{pharmacy.estimatedDeliveryTime}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Services</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Lab Tests</Badge>
                <Badge variant="outline">24x7</Badge>
                {pharmacy.deliveryAvailable && <Badge variant="outline">Home Delivery</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="medicines">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medicines">Order Medicines</TabsTrigger>
          <TabsTrigger value="location">View Location</TabsTrigger>
        </TabsList>
        <TabsContent value="medicines" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Medicines</CardTitle>
              <CardDescription>Get your medicines delivered from {pharmacy.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Delivery time:</span> {pharmacy.estimatedDeliveryTime || 'Not available'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Minimum order:</span> ₹{pharmacy.minimumOrderAmount || '0'}
                </div>
                <div className="text-sm">
                  <Badge variant="outline" className="mr-2">24x7</Badge>
                  <span>Order anytime, day or night</span>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button className="flex-1" variant="outline">
                  <Link to={`/upload-prescription?pharmacyId=${pharmacy.id}`}>
                    Upload Prescription
                  </Link>
                </Button>
                <Button className="flex-1">
                  <Link to={`/pharmacies/${pharmacy.id}/order`}>
                    Order Medicines
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="location" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                {pharmacy.address}, {pharmacy.city}, {pharmacy.state} - {pharmacy.pincode}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-48 rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Map view would be displayed here
                </p>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> Call
                </Button>
                <Button variant="outline" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" /> Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyDetailPage;