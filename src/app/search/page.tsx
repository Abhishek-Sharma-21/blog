'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  description: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.posts);
      } else {
        toast.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      toast.error('Error during search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Search Posts</h1>
            <p className="text-muted-foreground">Find the content you're looking for</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts by title, description, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isSearching} className="sm:w-auto">
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse all posts
                </p>
                <Button asChild>
                  <Link href="/">Browse All Posts</Link>
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    Search Results
                  </h2>
                  <p className="text-muted-foreground">
                    Found {searchResults.length} post{searchResults.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((post) => (
                    <article
                      key={post.id}
                      className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <User className="h-4 w-4" />
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                          <Link 
                            href={`/post/${post.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {highlightText(post.title, query || '')}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {highlightText(post.description, query || '')}
                        </p>
                        
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/post/${post.slug}`}>
                            Read More
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Ready to Search?</h3>
            <p className="text-muted-foreground mb-6">
              Enter your search terms above to find posts by title, description, or content.
            </p>
            <div className="max-w-md mx-auto text-sm text-muted-foreground space-y-2">
              <p>💡 <strong>Search tips:</strong></p>
              <ul className="text-left space-y-1">
                <li>• Use specific keywords for better results</li>
                <li>• Try different variations of your search terms</li>
                <li>• Search is case-insensitive</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}