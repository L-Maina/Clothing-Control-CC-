'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, Camera, Heart, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Newsletter } from '@/components/sections/Newsletter';

interface CommunityPhoto {
  id: string;
  imageUrl: string;
  username: string;
  productId: string;
  approved: boolean;
  createdAt: string;
}

export default function CommunityPage() {
  const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/community');
        const data = await response.json();
        setPhotos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch community photos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <CartDrawer />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">COMMUNITY</h1>
            </div>
            <p className="text-white/50 mt-2">Style inspiration from our amazing customers</p>
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-white/10 p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Join the Movement</h2>
                <p className="text-white/60">Follow us on social media and tag #ClothingCtrl to get featured</p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/clothing.ctrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@clothing.ctrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-black border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Community Members', value: '5,000+' },
              { label: 'Style Photos', value: '1,200+' },
              { label: 'Countries', value: '12' },
              { label: 'Five-Star Reviews', value: '500+' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-zinc-900 border border-white/10 p-6 text-center">
                <p className="text-3xl font-black text-amber-400">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Photo Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              #ClothingCtrl Style Gallery
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative aspect-square bg-zinc-900 overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`Style by ${photo.username}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <div>
                        <p className="text-white font-medium">@{photo.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-white" />
                        <MessageCircle className="w-5 h-5 text-white" />
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 border border-white/10 p-12 text-center">
                <Camera className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No community photos yet.</p>
                <p className="text-white/30 text-sm mt-2">Be the first to share your style!</p>
              </div>
            )}
          </section>

          {/* How to Get Featured */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">How to Get Featured</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Wear Your Gear',
                  description: 'Style your favorite Clothing Ctrl pieces in your unique way',
                },
                {
                  step: '2',
                  title: 'Snap a Photo',
                  description: 'Take a fire photo showing off your outfit',
                },
                {
                  step: '3',
                  title: 'Tag Us',
                  description: 'Post on Instagram or TikTok with #ClothingCtrl and tag @clothing.ctrl',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-900 border border-white/10 p-6">
                  <div className="w-10 h-10 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="bg-zinc-900 border border-white/10 p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Join the Community</h2>
              <p className="text-white/60 mb-6">
                Subscribe to get style tips, exclusive drops, and community highlights delivered to your inbox.
              </p>
              <Newsletter />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
