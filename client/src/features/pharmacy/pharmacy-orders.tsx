import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPharmacyOrders, getPharmacy } from '../../lib/api';
import { Package, MapPin, Calendar, ArrowUpRight, ArrowRight, ShoppingBag } from 'lucide-react';
import { PharmacyOrder } from '../../lib/types';

const OrderStatusBadge: React.FC<{ status: string, className?: string }> = ({ status, className }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className={`bg-yellow-100 text-yellow-800 hover:bg-yellow-100 ${className || ''}`}>Pending</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className={`bg-blue-100 text-blue-800 hover:bg-blue-100 ${className || ''}`}>Confirmed</Badge>;
    case 'processing':
      return <Badge variant="outline" className={`bg-purple-100 text-purple-800 hover:bg-purple-100 ${className || ''}`}>Processing</Badge>;
    case 'shipped':
      return <Badge variant="outline" className={`bg-indigo-100 text-indigo-800 hover:bg-indigo-100 ${className || ''}`}>Shipped</Badge>;
    case 'delivered':
      return <Badge variant="outline" className={`bg-green-100 text-green-800 hover:bg-green-100 ${className || ''}`}>Delivered</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className={`bg-red-100 text-red-800 hover:bg-red-100 ${className || ''}`}>Cancelled</Badge>;
    default:
      return <Badge variant="outline" className={className || ''}>{status}</Badge>;
  }
};

const PaymentStatusBadge: React.FC<{ status: string, className?: string }> = ({ status, className }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className={`text-xs ${className || ''}`}>Payment Pending</Badge>;
    case 'processing':
      return <Badge variant="outline" className={`text-xs ${className || ''}`}>Processing</Badge>;
    case 'completed':
      return <Badge variant="outline" className={`text-xs bg-green-100 text-green-800 hover:bg-green-100 ${className || ''}`}>Paid</Badge>;
    case 'failed':
      return <Badge variant="outline" className={`text-xs bg-red-100 text-red-800 hover:bg-red-100 ${className || ''}`}>Failed</Badge>;
    default:
      return <Badge variant="outline" className={`text-xs ${className || ''}`}>{status}</Badge>;
  }
};

const OrderCard: React.FC<{ order: PharmacyOrder }> = ({ order }) => {
  const { data: pharmacy } = useQuery({
    queryKey: ['pharmacy', order.pharmacyId],
    queryFn: () => getPharmacy(order.pharmacyId),
  });

  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-md flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Order #{order.id}
            <OrderStatusBadge status={order.status} className="ml-2" />
          </CardTitle>
          <CardDescription className="mt-1 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(order.orderDate)}
            {order.paymentStatus && (
              <PaymentStatusBadge status={order.paymentStatus} />
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {pharmacy && (
          <div className="mb-2 flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-sm">{pharmacy.name}</span>
          </div>
        )}
        <div className="mb-2">
          <p className="text-sm text-muted-foreground">Delivery to: {order.deliveryAddress}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm font-medium">
              Delivery: {order.estimatedDeliveryTime || 'Not available'}
            </p>
            <p className="text-sm text-muted-foreground">
              Fee: ₹{order.deliveryFee || '0'}
            </p>
          </div>
          <Button size="sm" className="flex items-center" asChild>
            <Link to={`/pharmacy-orders/${order.id}`}>
              View Order <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PharmacyOrdersPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['pharmacy-orders'],
    queryFn: () => getPharmacyOrders(),
  });

  const activeOrders = orders?.filter(order => 
    !['delivered', 'cancelled'].includes(order.status.toLowerCase())
  );
  
  const pastOrders = orders?.filter(order => 
    ['delivered', 'cancelled'].includes(order.status.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button onClick={() => setLocation('/pharmacies')}>
          Find Pharmacies
        </Button>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any pharmacy orders yet</p>
          <Button onClick={() => setLocation('/pharmacies')}>
            Browse Pharmacies
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeOrders && activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground mb-4">No active orders</p>
                <Button variant="outline" onClick={() => setLocation('/pharmacies')}>
                  Order Medicines
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastOrders && pastOrders.length > 0 ? (
              pastOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No past orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PharmacyOrdersPage;