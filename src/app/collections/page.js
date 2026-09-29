"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get("/api/collections");
      setCollections(data.data.collections);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-background-luxury border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="heading-sub">Curated For You</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            Our Collections
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Discover our curated collections — from Ramadan to Eid, from premium to limited editions.
          </p>
          <div className="divider-gold mt-8" />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">No collections available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, idx) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug}`}
                className="group relative overflow-hidden aspect-[4/5] block"
              >
                <img
                  src={
                    collection.image ||
                    `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80`
                  }
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-light mb-2">
                    Collection 0{idx + 1}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl mb-3 group-hover:text-gold transition-colors">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-white/50 pb-0.5 w-fit group-hover:text-gold group-hover:border-gold transition-colors">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
