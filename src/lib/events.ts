// src/lib/events.ts

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
  }
  
  export const events: Event[] = [
    {
      id: '1',
      title: 'Ganesh Chaturthi',
      description: 'Ganesh Chaturthi',
      date: '2024-09-07T10:00:00Z',
    },
    {
      id: '2',
      title: 'EID-E-MILAD',
      description: 'Eid-e-milad',
      date: '2024-09-16T14:00:00Z',
    },
    {
      id: '3',
      title: 'TECH ALEGRIA',
      description: 'Hackathon at Pillai College',
      date: '2024-09-20T10:00:00Z',
    },
    {
      id: '4',
      title: 'GANDHI JAYANTI',
      description: 'Gandhi Jayanti',
      date: '2024-10-02T10:00:00Z',
    },
    {
      id: '5',
      title: 'FSS',
      description: 'FSS',
      date: '2024-10-05T10:00:00Z',
     },
     {
      id: '6',
      title: 'DASHAHARA',
      description: 'Dashahara',
      date: '2024-10-12T10:00:00Z',
     },
     { 
      id: '7',
      title: 'FSS',
      description: 'FSS',
      date: '2024-10-19T10:00:00Z',
     },
     {
      id: '8',
      title: 'IA II',
      description: 'Gandhi Jayanti',
      date: '2024-10-21T10:00:00Z',
     },
     {
      id: '9',
      title: 'IA II',
      description: 'Gandhi Jayanti',
      date: '2024-10-22T10:00:00Z',
     },
     {
      id: '10',
      title: 'IA II',
      description: 'Gandhi Jayanti',
      date: '2024-10-23T10:00:00Z',
     },
     {
      id: '11',
      title: 'VIVA/PRACT',
      description: 'Viva/Pract',
      date: '2024-10-28T10:00:00Z',
     },
     {
      id: '12',
      title: 'VIVA/PRACT ',
      description: 'Viva/Pract',
      date: '2024-10-29T10:00:00Z',
     },
     {
      id: '13',
      title: 'DIWALI',
      description: 'Gandhi Jayanti',
      date: '2024-10-02T10:00:00Z',
     },
  ];
  
  console.log('Events loaded:', events.length);
