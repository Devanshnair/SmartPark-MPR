interface ParkingSpot {
    id: string;
    name: string;
    imageUrl: string;
    address?: string;
    distance?: string;
    time: string;
    rating: number;
    price: string;
    availableSlots: number;
    availableTypes?: string[];
    reviews?: number;
  }

export const PARKING_SPOTS: ParkingSpot[] = [
    {
      id: "1",
      name: "Trios Fashion Mall Parking",
      imageUrl: "https://cdn11.bigcommerce.com/s-64cbb/product_images/uploaded_images/tgtechnicalservices-246300-parking-garage-safer-blogbanner1.jpg",
      address: "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      distance: "2.5 km",
      time: "10 mins",
      rating: 4.2,
      price: "50",
      availableSlots: 92,
      availableTypes: ["Compact", "SUV", "Bike"]
    },
    {
      id: "2",
      name: "Runwal Greens Parking",
      imageUrl: "https://www.adanirealty.com/-/media/project/realty/blogs/what-is-stilt-parking-meaning-rules-how-it-works.ashx",
      address: "GMLR Road, Nahur West, Mumbai, Maharashtra 400078",
      distance: "4.0 km",
      time: "15 mins",
      rating: 4.5,
      price: "60",
      availableSlots: 1152,
      availableTypes: ["Compact", "SUV"]
    },
    {
      id: "3",
      name: "Indiabulls Finance Center Parking",
      imageUrl: "https://raicdn.nl/cdn-cgi/image/width=3840,quality=75,format=auto,sharpen=1/https://edge.sitecorecloud.io/raiamsterda13f7-raidigitalpdb6c-productionf3f5-ef30/media/project/rai-amsterdam-xmc/intertraffic/intertraffic/news/2022/9/parkingshape1-550-x-300-px.png",
      address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      distance: "3.2 km",
      time: "12 mins",
      rating: 4.3,
      price: "70",
      availableSlots: 890,
      availableTypes: ["Compact", "Bike"]
    },
    {
      id: "4",
      name: "Kalpataru Avana Parking",
      imageUrl: "https://www.99acres.com/microsite/articles/files/2018/07/car-parking.jpg",
      address: "Gen Nagesh Marg, Parel, Mumbai, Maharashtra 400012",
      distance: "2.8 km",
      time: "9 mins",
      rating: 4.1,
      price: "55",
      availableSlots: 553,
      availableTypes: ["SUV", "Bike"]
    },
    {
      id: "5",
      name: "MCGM Parking Lot Andheri",
      imageUrl: "https://raicdn.nl/cdn-cgi/image/width=3840,quality=75,format=auto,sharpen=1/https://edge.sitecorecloud.io/raiamsterda13f7-raidigitalpdb6c-productionf3f5-ef30/media/project/rai-amsterdam-xmc/intertraffic/intertraffic/news/2022/9/parkingshape1-550-x-300-px.png",
      address: "Jay Prakash Road, Andheri West, Mumbai, Maharashtra 400058",
      distance: "6.0 km",
      time: "20 mins",
      rating: 3.9,
      price: "40",
      availableSlots: 144,
      availableTypes: ["Compact"]
    },
    {
      id: "6",
      name: "Boomerang Building Parking",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_wSea4YuTq1WQhGOLBTPRps6qIlRzw1GlSA&s",
      address: "Chandivali Farm Road, Kurla West, Mumbai, Maharashtra 400072",
      distance: "5.5 km",
      time: "18 mins",
      rating: 4.0,
      price: "65",
      availableSlots: 161,
      availableTypes: ["Compact", "SUV"]
    },
    {
      id: "7",
      name: "Lodha The World Towers Parking",
      imageUrl: "https://www.glamox.com/globalassets/pbs/application-guide/industry/parking-garage-kremmergarden-parkering.jpg?w=1200&h=630&mode=crop",
      address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      distance: "3.0 km",
      time: "10 mins",
      rating: 4.7,
      price: "90",
      availableSlots: 3856,
      availableTypes: ["Compact", "SUV", "Bike"]
    },
    {
      id: "8",
      name: "Runwal Cumballa Hill Parking",
      imageUrl: "https://parkingtelecom.com/en/wp-content/uploads/sites/2/2020/03/off-street-parking-management-problem-1-mins-6000x3000.jpg",
      address: "Nepeansea Road, Mumbai, Maharashtra 400006",
      distance: "4.8 km",
      time: "16 mins",
      rating: 4.4,
      price: "75",
      availableSlots: 57,
      availableTypes: ["Compact", "SUV"]
    },
    {
      id: "9",
      name: "MCGM Parking Lot Powai",
      imageUrl: "https://parkingtelecom.com/en/wp-content/uploads/sites/2/2020/03/off-street-parking-management-problem-1-mins-6000x3000.jpg",
      address: "Saki Vihar Road, Powai, Mumbai, Maharashtra 400072",
      distance: "7.2 km",
      time: "25 mins",
      rating: 3.8,
      price: "35",
      availableSlots: 185,
      availableTypes: ["Bike"]
    },
    {
      id: "10",
      name: "The Address by Wadhwa Parking",
      imageUrl: "https://www.nobrokerhood.com/blog/wp-content/uploads/2024/08/shutterstock_2350654213-1-1568x706.jpg",
      address: "LBS Marg, Vikhroli West, Mumbai, Maharashtra 400083",
      distance: "6.5 km",
      time: "22 mins",
      rating: 4.6,
      price: "80",
      availableSlots: 824,
      availableTypes: ["Compact", "SUV"]
    }
  ];
  