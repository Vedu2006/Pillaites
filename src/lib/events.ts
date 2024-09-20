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
      title: 'Hackathon',
      description: 'Hackathon at Pillai Mini',
      date: '2024-09-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Celebration',
      description: 'Celebration at Mini College',
      date: '2024-09-22T14:00:00Z',
    },
    {
      id: '1',
      title: 'Hackathon',
      description: 'Hackathon at Pillai Mini',
      date: '2024-09-20T10:00:00Z',
    },
    // Add more events as needed
  ];
  
  console.log('Events loaded:', events.length);
