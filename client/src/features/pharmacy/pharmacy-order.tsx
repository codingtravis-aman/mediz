import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Minus, X, ShoppingCart, FileText, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPharmacy, getMedications, createPharmacyOrder } from '../../lib/api';
import { Pharmacy, Medication, PharmacyOrder, PharmacyOrderItem } from '../../lib/types';

// Define form schema
const orderFormSchema = z.object({
  prescriptionId: z.number().nullable().optional(),
  deliveryAddress: z.string().min(5, "Address must be at least 5 characters"),
  paymentMethod: z.enum(["cod", "online"]),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// Define medication items for the order
interface OrderMedication {
  medicationName: string;
  price: string;
  quantity: number;
  substituteAllowed: boolean;
}

const PharmacyOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for order medications
  const [orderMeds, setOrderMeds] = useState<OrderMedication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedPrice, setNewMedPrice] = useState('');
  const [newMedQuantity, setNewMedQuantity] = useState(1);
  const [newMedSubstitute, setNewMedSubstitute] = useState(false);
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      prescriptionId: null,
      deliveryAddress: '',
      paymentMethod: 'cod',
      notes: '',
    },
  });

  // Get pharmacy details
  const { data: pharmacy, isLoading: isLoadingPharmacy } = useQuery({
    queryKey: ['pharmacy', parseInt(id)],
    queryFn: () => getPharmacy(parseInt(id)),
  });

  // Get user's medications for quick add
  const { data: medications, isLoading: isLoadingMeds } = useQuery({
    queryKey: ['medications'],
    queryFn: () => getMedications(),
  });

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: (data: { order: Partial<PharmacyOrder>, items: Partial<PharmacyOrderItem>[] }) => 
      createPharmacyOrder(data.order, data.items),
    onSuccess: () => {
      toast({
        title: "Order placed successfully",
        description: "Your order has been sent to the pharmacy",
      });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-orders'] });
      setLocation('/pharmacy-orders');
    },
    onError: (error) => {
      toast({
        title: "Failed to place order",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Order error:", error);
    }
  });

  const addMedicationToOrder = () => {
    if (!newMedName || !newMedPrice) {
      toast({
        title: "Missing information",
        description: "Please provide both medication name and price",
        variant: "destructive",
      });
      return;
    }

    const newMed: OrderMedication = {
      medicationName: newMedName,
      price: newMedPrice,
      quantity: newMedQuantity,
      substituteAllowed: newMedSubstitute,
    };

    setOrderMeds([...orderMeds, newMed]);
    setNewMedName('');
    setNewMedPrice('');
    setNewMedQuantity(1);
    setNewMedSubstitute(false);
  };

  const removeMedicationFromOrder = (index: number) => {
    const updatedMeds = [...orderMeds];
    updatedMeds.splice(index, 1);
    setOrderMeds(updatedMeds);
  };

  const updateMedicationQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedMeds = [...orderMeds];
    updatedMeds[index].quantity = newQuantity;
    setOrderMeds(updatedMeds);
  };

  const quickAddMedication = (medication: Medication) => {
    const existingIndex = orderMeds.findIndex(med => 
      med.medicationName.toLowerCase() === medication.name.toLowerCase());

    if (existingIndex !== -1) {
      // If medication already exists, update quantity
      updateMedicationQuantity(existingIndex, orderMeds[existingIndex].quantity + 1);
    } else {
      // Add new medication
      const newMed: OrderMedication = {
        medicationName: medication.name,
        price: '0', // Price will be determined by pharmacy
        quantity: 1,
        substituteAllowed: false,
      };
      setOrderMeds([...orderMeds, newMed]);
    }
  };

  const calculateTotal = () => {
    return orderMeds.reduce((total, med) => {
      return total + (parseFloat(med.price) * med.quantity);
    }, 0);
  };

  const onSubmit = (data: OrderFormValues) => {
    if (orderMeds.length === 0) {
      toast({
        title: "No medications in order",
        description: "Please add at least one medication to your order",
        variant: "destructive",
      });
      return;
    }

    const orderItems: Partial<PharmacyOrderItem>[] = orderMeds.map(med => ({
      medicationName: med.medicationName,
      price: med.price,
      quantity: med.quantity,
      substituteAllowed: med.substituteAllowed,
    }));

    const orderData: Partial<PharmacyOrder> = {
      pharmacyId: parseInt(id),
      deliveryAddress: data.deliveryAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes || null,
      prescriptionId: data.prescriptionId,
      status: 'pending',
      paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'processing',
      deliveryFee: pharmacy?.deliveryAvailable ? 
        (calculateTotal() >= (pharmacy?.minimumOrderAmount ? parseFloat(pharmacy.minimumOrderAmount) : 0) ? '0' : '40') 
        : '0',
    };

    createOrder.mutate({ order: orderData, items: orderItems });
  };

  if (isLoadingPharmacy) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Loading pharmacy details...</p>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Pharmacy not found</h2>
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
        onClick={() => setLocation(`/pharmacies/${id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to {pharmacy.name}
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Order from {pharmacy.name}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Add Medications</CardTitle>
              <CardDescription>Add medications to your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-3 items-end mb-4">
                <div className="col-span-4">
                  <Label htmlFor="medName">Medication Name</Label>
                  <Input 
                    id="medName" 
                    value={newMedName} 
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Enter medication name"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medPrice">Price (₹)</Label>
                  <Input 
                    id="medPrice" 
                    value={newMedPrice} 
                    onChange={(e) => setNewMedPrice(e.target.value)}
                    placeholder="Price"
                    type="number"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medQuantity">Quantity</Label>
                  <Input 
                    id="medQuantity" 
                    value={newMedQuantity} 
                    onChange={(e) => setNewMedQuantity(parseInt(e.target.value) || 1)}
                    type="number"
                    min="1"
                  />
                </div>
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="substitute" 
                      checked={newMedSubstitute}
                      onCheckedChange={(checked) => setNewMedSubstitute(checked === true)}
                    />
                    <Label htmlFor="substitute" className="text-sm">Allow substitute</Label>
                  </div>
                </div>
                <div className="col-span-1">
                  <Button onClick={addMedicationToOrder} className="w-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick add from current medications */}
              {!isLoadingMeds && medications && medications.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Quick add from your medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {medications.map(med => (
                      <Button 
                        key={med.id} 
                        variant="outline" 
                        size="sm"
                        onClick={() => quickAddMedication(med)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> {med.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {orderMeds.length > 0 ? (
                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderMeds.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {med.medicationName}
                          {med.substituteAllowed && (
                            <span className="text-xs text-muted-foreground block">
                              Substitute allowed
                            </span>
                          )}
                        </TableCell>
                        <TableCell>₹{med.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateMedicationQuantity(index, med.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span>{med.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateMedicationQuantity(index, med.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>₹{(parseFloat(med.price) * med.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeMedicationFromOrder(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 bg-muted/20 rounded-md">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No medications added to order</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Details</CardTitle>
              <CardDescription>Enter your delivery information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your complete delivery address" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                            <SelectItem value="online">Online Payment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any special instructions or notes for the pharmacy" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => setLocation(`/pharmacies/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createOrder.isPending || orderMeds.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items ({orderMeds.length})</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {pharmacy.deliveryAvailable ? 
                      (calculateTotal() >= (pharmacy.minimumOrderAmount ? parseFloat(pharmacy.minimumOrderAmount) : 0) ? 
                        'Free' : '₹40') 
                      : 'N/A'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    ₹{(calculateTotal() + 
                      (pharmacy.deliveryAvailable && 
                       calculateTotal() < (pharmacy.minimumOrderAmount ? parseFloat(pharmacy.minimumOrderAmount) : 0) ? 
                       40 : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full text-sm text-muted-foreground">
                <div className="flex items-start mb-2">
                  <FileText className="h-4 w-4 mr-2 mt-0.5" />
                  <span>You can upload your prescription during checkout or add medications manually</span>
                </div>
                {pharmacy.deliveryAvailable && (
                  <div className="flex items-start">
                    <Truck className="h-4 w-4 mr-2 mt-0.5" />
                    <span>Free delivery for orders above ₹{pharmacy.minimumOrderAmount}</span>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyOrderPage;