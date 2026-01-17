// src/components/home/InstagramFeed.jsx
import { Instagram, Heart, MessageCircle, Send } from "lucide-react";

const InstagramFeed = () => {
  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400",
      likes: 245,
      comments: 32,
      caption: "Weekend vibes with our new collection 🛍️"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400",
      likes: 189,
      comments: 21,
      caption: "Style that speaks volumes ✨"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400",
      likes: 312,
      comments: 45,
      caption: "Your perfect fit is waiting 👗"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400",
      likes: 156,
      comments: 18,
      caption: "Elevate your everyday look 🌟"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400",
      likes: 278,
      comments: 39,
      caption: "Comfort meets style 🧥"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=400",
      likes: 421,
      comments: 67,
      caption: "Tag us in your #RealmWear outfits! 📸"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get daily style inspiration and see how our community styles Realm Wear products
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 font-semibold"
          >
            @realmwear
            <Send className="w-4 h-4" />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl aspect-square"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Interaction Stats */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-bold">{post.comments}</span>
                  </div>
                </div>
              </div>
              
              {/* Caption (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm line-clamp-2">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
            <Instagram className="w-5 h-5" />
            Follow for More Inspiration
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Share your photos using #RealmWearStyle for a chance to be featured!
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;