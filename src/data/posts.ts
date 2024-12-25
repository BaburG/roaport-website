export interface Post {
    id: string;
    name: string;
    imageUrl: string;
    longitude: number;
    latitude: number;
    dateCreated: string;
}

export const posts: Post[] = [
    {
        id: '1',
        name: 'Sunset at the beach',
        imageUrl: '/placeholder.svg?height=300&width=400',
        longitude: -122.4194,
        latitude: 37.7749,
        dateCreated: '2023-12-24T15:30:00Z',
    },
    {
        id: '2',
        name: 'City skyline',
        imageUrl: '/placeholder.svg?height=300&width=400',
        longitude: -74.0060,
        latitude: 40.7128,
        dateCreated: '2023-12-23T10:15:00Z',
    },
    {
        id: '3',
        name: 'Mountain view',
        imageUrl: '/placeholder.svg?height=300&width=400',
        longitude: -106.8175,
        latitude: 39.1911,
        dateCreated: '2023-12-22T08:45:00Z',
    },
];

