
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Plus, Search, Loader2, MapPin, Building, Briefcase } from 'lucide-react';
import { searchProfiles, fetchProfileDetails, addPerson } from '@/utils/profileService';
import { toast } from "@/components/ui/use-toast";
import { Person } from '@/utils/mockData';

interface ProfileResult {
  name: string;
  profileUrl: string;
  company?: string;
  role?: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

interface AddContactDialogProps {
  onContactAdded: (person: Person) => void;
}

export function AddContactDialog({ onContactAdded }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSelectedProfile(null);

    try {
      console.log("Searching for profiles with query:", searchQuery);
      const results = await searchProfiles(searchQuery);
      console.log("Search results:", results);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No results",
          description: `No profiles found for "${searchQuery}"`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to search profiles",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProfile = (profile: ProfileResult) => {
    setSelectedProfile(profile);
  };

  const handleAddContact = async () => {
    if (!selectedProfile) return;
    
    setIsAdding(true);
    
    try {
      // Fetch detailed profile information
      console.log("Fetching details for profile:", selectedProfile.profileUrl);
      const profileDetails = await fetchProfileDetails(selectedProfile.profileUrl);
      console.log("Profile details:", profileDetails);
      
      // Add the person to the system
      const result = await addPerson(profileDetails);
      
      if (result) {
        toast({
          title: "Success",
          description: `${selectedProfile.name} has been added to your contacts.`,
          duration: 3000,
        });
        
        // Close the dialog and reset
        setOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedProfile(null);
        
        // Notify parent component with the new person
        onContactAdded(result);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Search for a person to add to your contacts
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Search by name, company, or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button type="submit" size="sm" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {isSearching && (
          <div className="flex flex-col justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Searching online for "{searchQuery}"...</p>
          </div>
        )}
        
        {!isSearching && searchResults.length > 0 && (
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-2">
              {searchResults.map((profile, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer hover:border-primary transition-colors ${
                    selectedProfile?.profileUrl === profile.profileUrl ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelectProfile(profile)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border">
                        <img 
                          src={profile.profileImage || 'https://ui-avatars.com/api/?name=Unknown&background=random'} 
                          alt={profile.name} 
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium leading-none mb-1">{profile.name}</p>
                        {(profile.role || profile.company) && (
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            {profile.role && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                <span className="truncate">{profile.role}</span>
                              </div>
                            )}
                            {profile.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span className="truncate">{profile.company}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{profile.location}</span>
                          </div>
                        )}
                      </div>
                      {selectedProfile?.profileUrl === profile.profileUrl && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    
                    {selectedProfile?.profileUrl === profile.profileUrl && profile.bio && (
                      <div className="mt-2 border-t pt-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {profile.bio}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {!isSearching && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No results found for "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for a name, company, or role</p>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddContact}
            disabled={!selectedProfile || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Contact'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
