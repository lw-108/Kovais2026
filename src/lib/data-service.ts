/**
 * KOVAIS ENTERPRISE DATA SERVICE
 * 
 * ARCHITECTURE NOTE:
 * This service layer abstracts all external data interactions.
 * Currently, it uses a high-fidelity mock implementation (localStorage + artificial delays).
 * 
 * TO TRANSITION TO PRODUCTION:
 * 1. Replace the base methods (userService.login, bookingService.createGenericBooking) 
 *    with standard fetch/axios calls to your production API.
 * 2. Update the API_BASE_URL constant.
 * 3. Ensure your production backend returns matching schemas.
 */



// --- Shared Types ---
export interface User {
    user_id: number;
    username: string;
    points: number;
    emblem_url: string;
}

// --- Hotel Data ---
export const ROOMS = [
    {
      id: 1,
      type: 'Deluxe Suite',
      title: 'Premium Deluxe Suite with City View',
      description: 'Panoramic city views, smart home automation, premium bedding and a curated minibar. A stay that stays with you.',
      price: 4500,
      rating: 4.8,
      reviewCount: 342,
      location: 'Gobichettipalayam Premium District',
      lastBooked: '2 hours ago',
    }
];

// --- Barber Data ---
export const BARBER_SERVICES = [
    { id: 1, name: "Premium Haircut", price: 800, duration: "45 min", description: "Precision cut with luxury styling." },
    { id: 2, name: "Royal Shave", price: 600, duration: "30 min", description: "Hot towel and straight razor experience." },
    { id: 3, name: "Full Grooming", price: 2500, duration: "90 min", description: "The ultimate Kovais signature service." }
];

// --- Spa Data ---
export const SPA_SERVICES = {
    Men: [
      { id: 's1m', name: 'Swedish Massage', amount: 2500, description: 'Relax and relieve stress with kneading and tapping techniques.', imageUrl: 'https://massagenownepa.com/wp-content/uploads/2021/08/Top-10-Benefits-of-Swedish-Massage-Therapy-3.jpeg' },
      { id: 's2m', name: 'Aromatherapy Ritual', amount: 3000, description: 'Essential oil massage for deep sensory rejuvenation.', imageUrl: 'https://mtroyalspa.com/media/main/images/image_3.normal.png' },
      { id: 's3m', name: 'Traditional Thai', amount: 2800, description: 'Acupressure and assisted yoga postures for flexibility.', imageUrl: 'https://t4.ftcdn.net/jpg/00/49/84/71/360_F_49847134_GDTYb3FKMNxHDPvZ35OlMPT6G3Wpfkpm.jpg' },
    ],
    Women: [
      { id: 's1w', name: 'Signature Swedish', amount: 2500, description: 'Elegant stress relief and muscle kneading.', imageUrl: 'https://images.squarespace-cdn.com/content/v1/63a35472a0ab201630426c20/424ec407-ad4d-431d-a1c7-126bea60d868/Head-Massage-FloridaAcademy-1500x1000.jpg' },
      { id: 's2w', name: 'Aromatherapy Bliss', amount: 3000, description: 'Calming essential oil therapy for skin and soul.', imageUrl: 'https://us.123rf.com/450wm/kzenon/kzenon1401/kzenon140100090/25006116-chinese-asian-woman-in-wellness-beauty-spa-having-aroma-therapy-massage-with-essential-oil-looking.jpg?ver=6' },
      { id: 's3w', name: 'Floral Thai Massage', amount: 2800, description: 'Traditional healing combined with floral essences.', imageUrl: 'https://t3.ftcdn.net/jpg/07/81/44/36/360_F_781443695_k9Y2KZgZemjtnTybNPD4gSFP1OLcD90H.jpg' },
    ]
};

// --- Parlour Data ---
export const PARLOUR_PRODUCTS = [
    { id: 'p1', category: 'Hair Care', name: 'Luxury Hair Spa', price: 1500, duration: '90 min', description: 'Deep conditioning treatment with premium oils.', image: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'p2', category: 'Skin Care', name: '24K Gold Facial', price: 3500, duration: '75 min', description: 'Luxurious brightening treatment for radiant skin.', image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 'p3', category: 'Makeup', name: 'Bridal Perfection', price: 15000, duration: '240 min', description: 'HD finish for your most special day.', image: 'https://images.pexels.com/photos/2442900/pexels-photo-2442900.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

// --- Gym Data ---
export const GYM_PLANS = [
    { id: 'g1', duration: '1 Month', price: 399, features: ['Full Equipment Access', 'Unlimited Group Classes', 'Locker Facility', 'Free Wi-Fi'] },
    { id: 'g2', duration: '3 Months', price: 1099, features: ['All Monthly Benefits', '1 Personal Training Session/Month', 'Nutrition Consultation', 'Priority Booking'] },
    { id: 'g3', duration: '6 Months', price: 2199, features: ['All Quarterly Benefits', '2 Personal Training Sessions/Month', 'Nutrition Consultation', 'Priority Booking'] },
    { id: 'g4', duration: '12 Months', price: 4099, features: ['All Semi-Annual Benefits', 'Unlimited Personal Training', 'Diet Plan Included', 'VIP Member Privileges'] },
];

// --- Function/Funeral Data ---
export const HALLS = [
    { id: 'h1', type: 'Grand Imperial Ballroom', price: 50000, capacity: 500, description: 'Regal setting for weddings and corporate galas.' },
    { id: 'h2', type: 'Serenity Memorial Hall', price: 15000, capacity: 100, description: 'Peaceful and respectful environment for memorial services.' },
];

// --- User Mock Service ---
export const userService = {
    login: async (username: string, _password: string): Promise<User> => {
        // PRODUCTION: return axios.post(`${API_BASE_URL}/auth/login`, { username, password });
        await new Promise(r => setTimeout(r, 400));
        const user = {
            user_id: 101,
            username: username || "Guest",
            points: 1250,
            emblem_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kovais"
        };
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem(`points_${user.user_id}`, JSON.stringify(user.points));
        window.dispatchEvent(new Event("auth-change"));
        return user;
    },
    
    signup: async (_name: string, _phone: string, _password: string) => {
        // PRODUCTION: return axios.post(`${API_BASE_URL}/auth/signup`, { name, phone, password });
        await new Promise(r => setTimeout(r, 500));
        return { message: "Account Created Successfully" };
    },

    getPoints: (userId: number) => {
        const pts = localStorage.getItem(`points_${userId}`);
        return pts ? JSON.parse(pts) : 1250;
    },

    updatePoints: (userId: number, newPoints: number) => {
        localStorage.setItem(`points_${userId}`, JSON.stringify(newPoints));
        window.dispatchEvent(new Event("auth-change"));
    }
};

// --- Booking Mock Service ---
export const bookingService = {
    createGenericBooking: async (type: string, bookingData: any) => {
        // PRODUCTION: return axios.post(`${API_BASE_URL}/bookings/${type}`, bookingData);
        await new Promise(r => setTimeout(r, 600));
        const history = JSON.parse(localStorage.getItem(`${type}_history`) || "[]");
        const newBooking = { 
            id: "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase(), 
            ...bookingData, 
            timestamp: new Date().toISOString() 
        };
        history.push(newBooking);
        localStorage.setItem(`${type}_history`, JSON.stringify(history));
        return { status: "success", order: newBooking };
    },

    createHotelBooking: (data: any) => bookingService.createGenericBooking('hotel', data),
    createBarberBooking: (data: any) => bookingService.createGenericBooking('barber', data),
    createSpaBooking: (data: any) => bookingService.createGenericBooking('spa', data),
    createParlourBooking: (data: any) => bookingService.createGenericBooking('parlour', data),
    createGymBooking: (data: any) => bookingService.createGenericBooking('gym', data),
    createHallBooking: (data: any) => bookingService.createGenericBooking('hall', data),
    createFuneralBooking: (data: any) => bookingService.createGenericBooking('funeral', data),
};
