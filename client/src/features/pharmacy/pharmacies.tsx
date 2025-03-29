import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Star, Clock, Truck, Phone, X } from 'lucide-react';
import { getPharmacies, searchPharmacies } from '../../lib/api';
import { Pharmacy } from '../../lib/types';

const PharmacyCard: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{pharmacy.name}</CardTitle>
          {pharmacy.rating && (
            <Badge variant="secondary" className="flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" /> {pharmacy.rating.toFixed(1)}
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center text-sm mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          {pharmacy.address}, {pharmacy.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {pharmacy.deliveryAvailable && (
            <Badge variant="outline" className="flex items-center text-xs">
              <Truck className="h-3 w-3 mr-1" /> Free Delivery over ₹{pharmacy.minimumOrderAmount}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1" /> {pharmacy.hours}
          </Badge>
          <Badge variant="outline" className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1" /> {pharmacy.phone}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/pharmacies/${pharmacy.id}`}>View Details</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to={`/pharmacies/${pharmacy.id}/order`}>Order Medicines</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const PharmaciesPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('nearby');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: pharmacies, isLoading } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: () => getPharmacies(),
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['pharmacies', 'search', searchTerm],
    queryFn: () => searchPharmacies(searchTerm, userLocation || undefined),
    enabled: searchTerm.length >= 2,
  });

  useEffect(() => {
    // Get user's location for "Nearby" tab
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2) {
      setActiveTab('search');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveTab('nearby');
  };

  const displayPharmacies = activeTab === 'search' && searchTerm.length >= 2 
    ? searchResults 
    : pharmacies;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pharmacies</h1>
        <Button variant="outline" onClick={() => setLocation('/medications')}>
          Back to Medications
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for pharmacies by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={clearSearch} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">Nearby Pharmacies</TabsTrigger>
          <TabsTrigger value="all">All Pharmacies</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading || searchLoading ? (
        <div className="text-center py-10">Loading pharmacies...</div>
      ) : !displayPharmacies || displayPharmacies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No pharmacies found</p>
          <Button onClick={clearSearch}>Reset Search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayPharmacies.map((pharmacy) => (
            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmaciesPage;