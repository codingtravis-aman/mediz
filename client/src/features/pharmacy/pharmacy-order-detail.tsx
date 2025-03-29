import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Calendar, Package, Phone, FileText, Truck, Clock, AlertTriangle } from 'lucide-react';
import { getPharmacyOrder, getPharmacy, updatePharmacyOrderStatus } from '../../lib/api';

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Processing</Badge>;
    case 'shipped':
      return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Shipped</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const PharmacyOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ['pharmacy-order', parseInt(id)],
    queryFn: () => getPharmacyOrder(parseInt(id)),
  });

  const { data: pharmacy, isLoading: isLoadingPharmacy } = useQuery({
    queryKey: ['pharmacy', order?.pharmacyId],
    queryFn: () => getPharmacy(order!.pharmacyId),
    enabled: !!order,
  });

  // Cancel order mutation
  const cancelOrder = useMutation({
    mutationFn: () => updatePharmacyOrderStatus(parseInt(id), 'cancelled'),
    onSuccess: () => {
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-order', parseInt(id)] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-orders'] });
    },
    onError: () => {
      toast({
        title: "Failed to cancel order",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy h:mm a');
  };

  if (isLoading || (order && isLoadingPharmacy)) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Order not found</h2>
        <Button onClick={() => setLocation('/pharmacy-orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  const isOrderCancellable = ['pending', 'confirmed'].includes(order.status.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4" 
        onClick={() => setLocation('/pharmacy-orders')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="h-5 w-5 mr-2" /> Order #{order.id}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> Placed on {formatDate(order.orderDate)}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <OrderStatusBadge status={order.status} />
          
          {isOrderCancellable && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="ml-4" size="sm">
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The order will be cancelled and you will need to place a new order if you still want these medications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancelOrder.mutate()}>
                    Yes, cancel order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* This would need to be updated to show actual order items from API */}
                  <TableRow>
                    <TableCell className="font-medium">
                      Example Medication
                      <span className="block text-xs text-muted-foreground">
                        {Math.random() > 0.5 ? 'Substitute allowed' : 'No substitution'}
                      </span>
                    </TableCell>
                    <TableCell>₹100.00</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell className="text-right">₹200.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Another Medication
                      <span className="block text-xs text-muted-foreground">
                        No substitution
                      </span>
                    </TableCell>
                    <TableCell>₹75.50</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right">₹75.50</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹275.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{parseFloat(order.deliveryFee) + 275.50}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Delivery Address</h3>
                  <p className="text-sm">{order.deliveryAddress}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Delivery Status</h3>
                  <div className="flex items-center">
                    <OrderStatusBadge status={order.status} />
                    {order.status.toLowerCase() === 'shipped' && (
                      <span className="text-sm ml-2">Expected by {order.estimatedDeliveryTime}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Order Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.notes || 'No additional notes for this order.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                  <p className="text-sm">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    {order.paymentStatus && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {pharmacy && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Pharmacy Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">{pharmacy.name}</h3>
                  <p className="text-sm flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{pharmacy.address}, {pharmacy.city}</span>
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{pharmacy.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{pharmacy.hours || 'Hours not available'}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/pharmacies/${pharmacy.id}`}>View Pharmacy</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Having issues with your order?</p>
                  <p className="text-muted-foreground">Contact the pharmacy directly or get help from our support team.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Prescription required?</p>
                  <p className="text-muted-foreground">Upload your prescription if you haven't already.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Truck className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Delivery issues?</p>
                  <p className="text-muted-foreground">
                    {order.status === 'delivered' 
                      ? 'If you haven\'t received your order, please contact us.' 
                      : 'Your order is being processed. Please allow time for delivery.'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyOrderDetailPage;