import { Button } from '@/components/ui/button'
import { Edit3, Instagram, Mail, MapPin, Phone, X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@clerk/nextjs'
type Props = {}

type Pet = {
    id: string;
    name: string;
    breed: string;
    age: number;
    images : string[]
    // Include other properties of a pet here as needed
  };

type User = {
    firstName: string;
    lastName : string;
    location: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    bio: string;
    profileImage: string;
    recentActivity: string[];
    pets: Pet[];
};


const user = {
    name: 'Samanta Smith',
    location: 'California',
    email: 'samantasmith@gmail.com',
    phone: '702-684-2621',
    address: 'Las Vegas 1028 Hall Street',
    instagram: 'samanta.s16',
    bio: '',
    profileImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-09%20at%209.17.11%E2%80%AFPM-w8ubFc8nDHhAJuTrvzoN9v94AawTMc.png',
    recentActivity: [
        'Adopted a dog from the local shelter.',
        'Updated bio to reflect new pet adoption.',
        'Joined the Furry Friends Charity event.'
      ],
      pets: ['Papi'],
  }

const UserProfile = (props: Props) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = () => {
    // TODO: Save the bio to the backend (API call)
    setIsEditing(false);
  };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/user");
                if (!res.ok) throw new Error("Failed to fetch user data");
                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    console.log("USERRRRRR ", userData)
    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>User not found</p>;

  return (
    <div className="flex flex-col lg:flex-row space-x-6">
      {/* Left Sidebar Navigation */}
      <div className="w-full lg:w-1/4 bg-gray-100 p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex items-center justify-center flex-col space-y-4">
          <Avatar className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-xl hover:shadow-2xl transition duration-300">
            <AvatarImage
              src={userData.profileImage}
              alt={userData.firstName.slice(0,1)}
            />
            {/* <AvatarFallback>{userData.name.slice(0, 2)}</AvatarFallback> */}
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-800">{userData.firstName} {userData.lastName}</h2>
          <p className="text-gray-600 text-sm">{user.location}</p>
          <Button variant="outline" className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 mt-4">
            <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Contact Info</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">{userData.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">{user.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Instagram className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">{user.instagram}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-lg">
        {/* Bio Section */}
        {/* <div className="mt-6 p-6 bg-indigo-50 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl text-indigo-700">About Me</h3>
          <p className="text-gray-700">
            {user.bio}
          </p>
        </div> */}

<div className="mt-6 p-6 bg-indigo-50 rounded-xl shadow-lg">
      <h3 className="font-semibold text-xl text-indigo-700 flex justify-between">
        About Me
        {!isEditing && ( // Show "Edit" button only when not editing
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-indigo-600 text-sm hover:underline"
          >
            Edit
          </button>
        )}
      </h3>

      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 mt-2 border rounded-lg"
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mt-2">{bio || "Write something about yourself..."}</p>
      )}
    </div>

        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-xl text-indigo-700">My Pets</h3>
          <div className="flex flex-wrap space-x-4 mt-2">
            {userData.pets.map((pet, index) => (
              <div key={index} className="bg-indigo-100 p-4 rounded-lg w-24 text-center">
              {typeof pet.images?.[0] === 'string' ? (
    <Image
        src={pet.images[0]}
        alt={pet.name}
        width={64}
        height={64}
        className="object-cover rounded-full mb-2"
    />
) : (
    <div className="w-16 h-16 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
        No Image
    </div>
)}
                <span className="text-gray-800">{pet.name}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="text-indigo-600 hover:bg-indigo-50 mt-4">
            Add Pet
          </Button>
        </div>

        <div className="mt-6 p-6 bg-gray-50 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl text-indigo-700">Recent Activity</h3>
          <p className='mt-3'>No Recent Activity</p>
          {/* <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {user.recentActivity.map((activity, index) => (
              <li key={index} className='hover:bg-gray-100 p-2 rounded-md transition duration-300'>{activity}</li>
            ))}
          </ul> */}
        </div>

      
        {/* Charity Section */}
        <div className="bg-gray-50 mt-6 p-6 rounded-lg shadow-lg">
          <div className="relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <Image src="/petPicture2.jpg" alt="Dog" width={64} height={64} className="object-cover" />
                </div>
                
                {/* More images for charity items */}
              </div>
              <p className="text-center text-gray-700">Join Furry Friends Charity</p>
              <Button variant="outline" className="text-indigo-600 hover:bg-indigo-50">
                Donate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default UserProfile