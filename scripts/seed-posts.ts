import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const seedPosts = [
  {
    title: '10 Tips for a Successful Home Renovation',
    slug: '10-tips-for-successful-home-renovation',
    excerpt: 'Learn the essential tips for planning and executing a home renovation project that stays on budget and on schedule.',
    content: '<h2>Planning Your Renovation</h2><p>A successful home renovation starts with careful planning. Here are our top tips to ensure your project goes smoothly...</p><h3>1. Set a Realistic Budget</h3><p>Before starting any renovation, determine how much you can afford to spend. Include a 10-20% buffer for unexpected costs.</p><h3>2. Choose the Right Contractor</h3><p>Research contractors thoroughly. Check references, reviews, and ensure they are properly licensed and insured.</p>',
    author: 'John Doe',
    image: '/assets/images/blog/renovation-tips.jpg',
    alt: 'Home renovation project in progress',
    category: 'Renovation',
    status: 'published' as const,
    published_at: '2024-12-15T00:00:00Z'
  },
  {
    title: 'Modern Kitchen Design Trends 2024',
    slug: 'modern-kitchen-design-trends-2024',
    excerpt: 'Explore the latest trends in kitchen design and how to incorporate them into your home.',
    content: '<h2>The Future of Kitchen Design</h2><p>Kitchen design continues to evolve with new materials, colors, and layouts. Here are the trends dominating 2024...</p><h3>Minimalist Aesthetics</h3><p>Clean lines, handleless cabinets, and integrated appliances create a seamless, modern look.</p><h3>Bold Color Choices</h3><p>Deep blues, forest greens, and warm terracottas are replacing all-white kitchens.</p>',
    author: 'Jane Smith',
    image: '/assets/images/blog/kitchen-trends.jpg',
    alt: 'Modern kitchen design with latest trends',
    category: 'Design',
    status: 'published' as const,
    published_at: '2024-12-10T00:00:00Z'
  },
  {
    title: 'Choosing the Right Materials for Your Project',
    slug: 'choosing-right-materials-for-your-project',
    excerpt: 'A comprehensive guide to selecting the best materials for different applications in your home.',
    content: '<h2>Material Selection Guide</h2><p>Choosing the right materials can make or break your renovation project. Consider durability, aesthetics, and budget...</p><h3>Flooring Options</h3><p>Hardwood, tile, laminate, and vinyl each have their pros and cons depending on the room and usage.</p><h3>Countertop Materials</h3><p>From granite to quartz to butcher block, understand the benefits of each material.</p>',
    author: 'John Doe',
    image: '/assets/images/blog/materials-guide.jpg',
    alt: 'Various construction materials displayed',
    category: 'Materials',
    status: 'draft' as const,
    published_at: null
  },
  {
    title: 'Bathroom Remodeling: Where to Splurge and Where to Save',
    slug: 'bathroom-remodeling-splurge-vs-save',
    excerpt: 'Expert advice on which bathroom elements are worth the investment and where you can cut costs.',
    content: '<h2>Smart Bathroom Budget Allocation</h2><p>Remodeling a bathroom requires strategic spending to get the best value...</p><h3>Splurge On: Quality Fixtures</h3><p>Invest in durable faucets, showerheads, and hardware that will last for years.</p><h3>Save On: Decorative Elements</h3><p>Towels, accessories, and artwork can be budget-friendly and easily updated later.</p>',
    author: 'Jane Smith',
    image: '/assets/images/blog/bathroom-remodel.jpg',
    alt: 'Beautiful remodeled bathroom',
    category: 'Renovation',
    status: 'published' as const,
    published_at: '2024-12-05T00:00:00Z'
  },
  {
    title: 'Sustainable Building Materials for Eco-Friendly Homes',
    slug: 'sustainable-building-materials-eco-friendly',
    excerpt: 'Discover environmentally-friendly materials that reduce your carbon footprint without sacrificing quality.',
    content: '<h2>Building Green</h2><p>Sustainable materials are better for the environment and often healthier for your home...</p><h3>Reclaimed Wood</h3><p>Beautiful, unique, and environmentally responsible - reclaimed wood adds character to any space.</p><h3>Bamboo Flooring</h3><p>Fast-growing and durable, bamboo is an excellent alternative to traditional hardwood.</p>',
    author: 'John Doe',
    image: '/assets/images/blog/eco-materials.jpg',
    alt: 'Sustainable building materials',
    category: 'Materials',
    status: 'published' as const,
    published_at: '2024-11-28T00:00:00Z'
  }
];

async function seed() {
  console.log('🌱 Seeding blog posts...');

  for (const post of seedPosts) {
    console.log('Inserting:', post.title);
    
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select();

    if (error) {
      console.error('❌ Error on post:', post.title);
      console.error('Error:', error);
      continue;
    }
    console.log('✅ Inserted:', post.title);
  }

  console.log('✅ Seeding complete');
  process.exit(0);
}

seed();
