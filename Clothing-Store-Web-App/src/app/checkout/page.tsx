'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore, useCurrencyStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { formatPrice, currency } = useCurrencyStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'paypal'>('mpesa');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Kenya',
    postalCode: '',
    mpesaNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const subtotal = getSubtotal();
  const freeShippingThreshold = 10000;
  const shippingCost = 500;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">Order Confirmed!</h1>
          <p className="text-white/60 mb-2">Thank you for your purchase.</p>
          <p className="text-white/40 text-sm mb-8">
            We've sent a confirmation email to {formData.email}
          </p>
          <Link href="/">
            <Button className="bg-amber-400 hover:!bg-amber-300 text-black font-bold px-8 py-4 rounded-none transition-colors">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <Link href="/">
            <Button className="bg-amber-400 hover:!bg-amber-300 text-black font-bold px-8 py-4 rounded-none transition-colors">
              START SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to shop
          </Link>
          <h1 className="text-3xl font-black text-white">CHECKOUT</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-zinc-900 border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (e.g., +254 7XX XXX XXX)"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-zinc-900 border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  Shipping Address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="sm:col-span-2 bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="UAE">UAE</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code (optional)"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-zinc-900 border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  Payment Method
                </h2>
                
                {/* Payment Options */}
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {/* M-Pesa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={cn(
                      "p-4 border text-center transition-all flex flex-col items-center gap-2",
                      paymentMethod === 'mpesa'
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="w-16 h-10 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs tracking-tight">M-PESA</span>
                    </div>
                    <span className="text-white font-medium text-sm">M-Pesa</span>
                  </button>
                  
                  {/* Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "p-4 border text-center transition-all flex flex-col items-center gap-2",
                      paymentMethod === 'card'
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="flex gap-1 items-center">
                      {/* Visa Logo */}
                      <svg className="h-8 w-10" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                        <path d="M19.5 21H17L18.5 11H21L19.5 21Z" fill="white"/>
                        <path d="M28 11L25.5 18L25 15.5L24 12C24 12 23.8 11 22.5 11H18.5L18.4 11.2C18.4 11.2 20 11.5 21.8 12.5L24 21H26.5L30.5 11H28Z" fill="white"/>
                        <path d="M32 21L32.5 18L30 18L29.5 21H32Z" fill="white"/>
                        <path d="M34.5 11C33.5 11 33 11.8 33 11.8L29 21H31.5L32 19.5H35L35.2 21H37.5L35.5 11H34.5ZM32.5 17.5L33.5 14.5L34 17.5H32.5Z" fill="white"/>
                        <path d="M15 11L12.5 18L12.2 16.5L11 12C11 12 10.8 11 9.5 11H5.1L5 11.2C5 11.2 7 11.6 9.2 13C11 14 12 15.5 12.5 17L11 21H13.5L16 11H15Z" fill="white"/>
                      </svg>
                      {/* Mastercard Logo */}
                      <svg className="h-8 w-10" viewBox="0 0 48 32" fill="none">
                        <rect width="48" height="32" rx="4" fill="#000"/>
                        <circle cx="18" cy="16" r="8" fill="#EB001B"/>
                        <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                        <path d="M24 10.5C25.8 12 27 14.3 27 16.8C27 19.3 25.8 21.6 24 23.1C22.2 21.6 21 19.3 21 16.8C21 14.3 22.2 12 24 10.5Z" fill="#FF5F00"/>
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm">Card</span>
                  </button>
                  
                  {/* PayPal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={cn(
                      "p-4 border text-center transition-all flex flex-col items-center gap-2",
                      paymentMethod === 'paypal'
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <svg className="h-8 w-16" viewBox="0 0 100 32" fill="none">
                      <rect width="100" height="32" rx="4" fill="#003087"/>
                      <path d="M25 10H18C17.5 10 17 10.4 16.9 10.9L14 25C13.9 25.3 14.1 25.5 14.4 25.5H18C18.5 25.5 18.9 25.1 19 24.6L19.8 20H23C26.5 20 29 17.5 29.5 14.5C30 11 27 10 25 10ZM25 14.5C24.8 16 23.5 17 22 17H20.5L21.2 13H23C24 13 25.2 13.5 25 14.5Z" fill="white"/>
                      <path d="M35 10H28C27.5 10 27 10.4 26.9 10.9L24 25C23.9 25.3 24.1 25.5 24.4 25.5H28C28.5 25.5 28.9 25.1 29 24.6L29.8 20H33C36.5 20 39 17.5 39.5 14.5C40 11 37 10 35 10ZM35 14.5C34.8 16 33.5 17 32 17H30.5L31.2 13H33C34 13 35.2 13.5 35 14.5Z" fill="#009CDE"/>
                      <path d="M45 10H38L37.9 10.9L40.8 25C40.9 25.3 41.1 25.5 41.4 25.5H45C45.5 25.5 45.9 25.1 46 24.6L48.9 10.9C49 10.6 48.8 10 48.5 10H45ZM43 22L41 13H44L43 22Z" fill="white"/>
                    </svg>
                    <span className="text-white font-medium text-sm">PayPal</span>
                  </button>
                </div>

                {/* M-Pesa Form */}
                {paymentMethod === 'mpesa' && (
                  <div className="bg-green-900/20 border border-green-500/20 p-4">
                    <p className="text-green-400 text-sm mb-3">
                      You'll receive an M-Pesa prompt on your phone to complete payment.
                    </p>
                    <input
                      type="tel"
                      name="mpesaNumber"
                      placeholder="M-Pesa Number (e.g., 0712345678)"
                      required
                      value={formData.mpesaNumber}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        name="cardCvc"
                        placeholder="CVC"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-900/20 border border-blue-500/20 p-4">
                    <p className="text-blue-400 text-sm">
                      You'll be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-400 hover:!bg-amber-300 text-black font-bold py-4 rounded-none text-lg transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    PROCESSING...
                  </span>
                ) : (
                  `PAY ${formatPrice(total)}`
                )}
              </Button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                <Shield className="w-4 h-4" />
                <span>Secure checkout powered by SSL encryption</span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-white/10 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-zinc-800 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-white/40 text-xs">{item.color} / {item.size}</p>
                      <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-white/40 text-right">in {currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
